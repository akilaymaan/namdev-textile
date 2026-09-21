"""Build product pages for Namdev Textile.

Parses the IndiaMART category markdown dumps (fetched via r.jina.ai),
downloads every product image locally (curl_cffi Chrome impersonation —
imimg CDN blocks plain curl), and emits:

  products/<slug>.html   — one Bose-style PDP per product
  products.html          — catalog page grouped by category
  products.json          — parsed data (for reuse)

Run from the project root:  python tools/build_products.py
"""

import html
import json
import os
import re
import time
from curl_cffi import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMP = os.environ.get("NT_TMP", os.path.join(os.environ.get("TEMP", "/tmp")))
IMG_DIR = os.path.join(ROOT, "img", "products")
PDP_DIR = os.path.join(ROOT, "products")
os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(PDP_DIR, exist_ok=True)

CATEGORIES = [
    ("men-sanganeri-shirt", "Men Sanganeri Shirt", "sanganeri"),
    ("men-jaipuri-shirt", "Men Jaipuri Shirt", "jaipuri"),
    ("hand-block-print-shirt", "Hand Block Print Shirt", "hand-block"),
    ("men-rajasthani-shirt", "Men Rajasthani Shirt", "rajasthani"),
    ("men-ajrakh-printed-shirt", "Men Ajrakh Printed Shirt", "ajrakh"),
    ("men-udaipuri-printed-shirt", "Men Udaipuri Printed Shirt", "udaipuri"),
    ("cambric-shirt", "Cambric Shirt", "cambric"),
    ("mens-linen-shirts", "Mens Linen Shirts", "linen"),
    ("men-shirts", "Men Shirts", "men-shirts"),
    ("cotton-fabric", "Cotton Fabric", "cotton-fabric"),
]

# IndiaMART spec keys — longest first for prefix matching
SPEC_KEYS = sorted([
    "Sleeve Length", "Sleeve type", "Sleeve Type", "Collar Type",
    "Print or Pattern", "Print/Pattern", "Prints/Pattern", "Prints",
    "Fit Type", "Wash Care", "All size", "All Size",
    "Product Type", "Country of Origin", "Packaging Type", "Occasion",
    "Occassion", "Ocassion", "Pattern", "Fabric GSM", "Fabric Content",
    "Fabric", "Material", "Colour", "Color", "Size", "Fit",
    "GSM", "Brand", "Type", "Design", "Usage", "Weave", "Yarn Count",
    "Width", "Season", "Set Content", "Number Of Pockets", "Pocket Detail",
    "Pocket", "Neck Type", "Neck", "Cuff", "Button", "Buttons",
    "Care Instructions", "Style", "Thickness", "Length", "Features",
    "Gender", "Age Group", "Technique", "Work", "Application",
    "Collar", "Sleeves", "Chest", "Shoulder", "Hem", "Cuffs",
    "Do You Accept", "Delivery Time", "Supply Ability", "Is It Customized",
    "Minimum Order Quantity", "Weight", "Packaging", "Quality",
    "Threads", "Count", "Transparency", "Texture", "Shrinkage",
    "Made In", "Ideal For", "Suitable For", "Stitching", "Print",
], key=len, reverse=True)

END_MARKERS = (
    "Yes! I am Interested", "Interested in this product", "Get Latest Price",
    "Request A Callback", "View Complete Details", "Ask More Details",
    "Explore More", "Looking for", "Tell us what you need",
)
SKIP_PREFIXES = ("![", "Get Best Quote", "Product Price", "Minimum Order Quantity:", "|")


KEY_RE = re.compile(r"\b(" + "|".join(re.escape(k) for k in SPEC_KEYS) + r")\s+")

KEY_NORM = {
    "All size": "All sizes", "All Size": "All sizes",
    "Print or Pattern": "Print / Pattern", "Print/Pattern": "Print / Pattern",
    "Sleeve type": "Sleeve Type",
}


def extract_specs(line, details):
    """Split a (possibly merged) spec line into key/value pairs.
    Returns True if the line was consumed as specs."""
    matches = list(KEY_RE.finditer(line))
    if not matches:
        return False
    # a real spec line starts with a key; merged spec lines have 2+ keys
    if matches[0].start() != 0 and len(matches) < 2:
        return False
    for i, m in enumerate(matches):
        key = KEY_NORM.get(m.group(1), m.group(1))
        end = matches[i + 1].start() if i + 1 < len(matches) else len(line)
        val = line[m.end():end].strip(" :\u00a0,;").replace("\ufffd", "\u2019")
        if val:
            details[key] = val
    return True


def clean_desc(line):
    line = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", line)      # inline images
    line = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", line)  # links -> text
    line = re.sub(r"\*\*", " ", line)                     # bold markers
    line = line.replace("\ufffd", "\u2019")               # mojibake -> apostrophe
    return line.strip(" *\u00a0")


DIM_RE = re.compile(r"^[\d\s*×xX.,]+\s*(gm|kg|cm|mm|in|inch|meter|m)?\.?$", re.I)


def slugify(name, used):
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "product"
    base, i = s, 1
    while s in used:
        i += 1
        s = f"{base}-{i}"
    used.add(s)
    return s


def parse_category(txt_path, cat_name, anchor):
    text = open(txt_path, encoding="utf-8").read()
    blocks = re.split(r"^##\s+", text, flags=re.M)
    products = []
    for block in blocks[1:]:
        # real products always carry "Product Price:" — EXPLORE MORE /
        # cross-category promo blocks and page chrome never do
        if "Product Price:" not in block:
            continue
        lines = [l.strip() for l in block.splitlines()]
        if not lines:
            continue
        name = lines[0].strip().strip("*").strip()
        if not name or name.startswith("[") or name.lower().startswith(("send", "contact", "about")):
            continue

        m = re.search(r"!\[[^\]]*\]\((https?://[^)\s]+)\)", block)
        img_url = m.group(1) if m else None

        pm = re.search(r"Product Price:\s*(?:Rs|₹)\s*([\d,]+(?:\.\d+)?)\s*/\s*([A-Za-z]+)", block)
        price = pm.group(1).replace(",", "") if pm else None
        unit = pm.group(2) if pm else "Piece"

        mm = re.search(r"Minimum Order Quantity:\s*([^\n]+)", block)
        moq = mm.group(1).strip() if mm else None

        details = {}
        desc_lines = []
        in_details = False
        for line in lines[1:]:
            if any(mark in line for mark in END_MARKERS):
                break
            if not line or line.startswith(SKIP_PREFIXES) or "Get Best Price" in line:
                continue
            if line.startswith("Product Details"):
                in_details = True
                continue
            if in_details:
                if extract_specs(line, details):
                    continue
                if DIM_RE.match(line):
                    continue
            cleaned = clean_desc(line)
            if cleaned:
                desc_lines.append(cleaned)
        desc = " ".join(desc_lines).strip()
        desc = re.sub(r"\s{2,}", " ", desc)

        products.append({
            "name": name, "img_url": img_url, "price": price, "unit": unit,
            "moq": moq, "details": details, "desc": desc,
            "category": cat_name, "anchor": anchor,
        })
    return products


# ---------------------------------------------------------------- images
def download_images(products):
    sess = requests.Session()
    for p in products:
        if not p["img_url"]:
            p["img"] = None
            continue
        ext = os.path.splitext(p["img_url"].split("?")[0])[1].lower()
        ext = {".jpeg": ".jpg", ".jpg": ".jpg", ".png": ".png", ".webp": ".webp"}.get(ext, ".jpg")
        fname = f"{p['slug']}{ext}"
        dest = os.path.join(IMG_DIR, fname)
        p["img"] = f"img/products/{fname}"
        if os.path.exists(dest) and os.path.getsize(dest) > 1000:
            continue
        ok = False
        for _ in range(3):
            try:
                r = sess.get(p["img_url"], impersonate="chrome", timeout=40)
                if r.status_code == 200 and len(r.content) > 1000:
                    with open(dest, "wb") as f:
                        f.write(r.content)
                    ok = True
                    break
            except Exception:
                pass
            time.sleep(2)
        if not ok:
            p["img"] = p["img_url"]  # fall back to remote (works in real browsers)
            print("IMG-FAIL", p["slug"])
        time.sleep(0.35)


# ---------------------------------------------------------------- templates
NAV = """<header class="nav" id="nav">
  <div class="nav__inner">
    <a href="{rel}index.html" class="nav__logo">
      <span class="nav__logo-mark">N</span>
      <span class="nav__logo-text">Namdev<em>Textile</em></span>
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="{rel}products.html">Shop</a>
      <a href="{rel}index.html#collection">Collection</a>
      <a href="{rel}index.html#craft">Craft</a>
      <a href="{rel}index.html#reviews">Reviews</a>
    </nav>
    <div class="nav__actions">
      <a href="tel:+917949095494" class="nav__phone">+91 79490 95494</a>
      <a href="tel:+917949095494" class="btn btn--pill">Call Us</a>
    </div>
  </div>
</header>"""

FOOT = """<footer class="footer footer--mini">
  <div class="footer__bottom footer__bottom--solo">
    <p>© Namdev Textile · Jaipur, Rajasthan · GST 08CIGPC2551L1Z9</p>
    <a href="tel:+917949095494">+91 79490 95494</a>
  </div>
</footer>"""

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content="{desc_meta}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{rel}css/styles.css" />
  <link rel="stylesheet" href="{rel}css/product.css" />
</head>
<body class="subpage">
"""

SCRIPTS = """<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
<script src="{rel}js/product.js"></script>
</body>
</html>"""

esc = html.escape


def chips(details, limit=4):
    order = ["Fabric", "Color", "Colour", "Fit Type", "Fit", "Sleeve Length",
             "Pattern", "Print / Pattern", "Occasion", "Size", "GSM"]
    picked = []
    for k in order:
        if k in details and k not in picked:
            picked.append(k)
    for k in details:
        if len(picked) >= limit:
            break
        if k not in picked:
            picked.append(k)
    return "".join(
        f'<li><span>{esc(k)}</span><strong>{esc(details[k])}</strong></li>'
        for k in picked[:limit]
    )


def spec_rows(details):
    return "".join(
        f'<div class="spec"><dt>{esc(k)}</dt><dd>{esc(v)}</dd></div>'
        for k, v in details.items()
    )


def rel_card(p, rel):
    price = f'<span class="relcard__price">₹{esc(p["price"])}<em>/{esc(p["unit"])}</em></span>' if p["price"] else ""
    img = f'<div class="relcard__img"><img src="{rel}{esc(p["img"])}" alt="{esc(p["name"])}" loading="lazy" /></div>' if p["img"] else ""
    return f"""<a class="relcard" href="{rel}products/{p['slug']}.html">
      {img}
      <div class="relcard__body"><h4>{esc(p["name"])}</h4>{price}</div>
    </a>"""


def render_pdp(p, related):
    crumbs = (
        f'<a href="../index.html">Home</a><i>/</i>'
        f'<a href="../products.html#{p["anchor"]}">{esc(p["category"])}</a><i>/</i>'
        f'<span>{esc(p["name"])}</span>'
    )
    price_html = ""
    if p["price"]:
        price_html = f"""<div class="pdp__price">
          <strong>₹{esc(p["price"])}</strong><span>/ {esc(p["unit"])}</span>
        </div>"""
    moq_html = f'<p class="pdp__moq">Minimum order quantity — <strong>{esc(p["moq"])}</strong></p>' if p["moq"] else ""
    chip_html = chips(p["details"])
    chip_block = f'<ul class="pdp__chips">{chip_html}</ul>' if chip_html else ""
    spec_block = f'<dl class="spec-grid">{spec_rows(p["details"])}</dl>' if p["details"] else ""
    desc_block = f'<p class="pdp__desc">{esc(p["desc"])}</p>' if p["desc"] else ""
    img_html = f'<img src="../{esc(p["img"])}" alt="{esc(p["name"])}" />' if p["img"] else '<div class="pdp__noimg">Image coming soon</div>'

    related_html = "".join(rel_card(r, "../") for r in related)

    return HEAD.format(
        title=f"{esc(p['name'])} — ₹{p['price'] or ''}/{p['unit']} | Namdev Textile",
        desc_meta=esc((p["desc"] or p["name"])[:150]),
        rel="../",
    ) + f"""
{NAV.format(rel="../")}
<div class="scroll-progress" id="scrollProgress"></div>
<main>
  <section class="pdp">
    <div class="pdp__glow" aria-hidden="true"></div>
    <nav class="pdp__crumbs" data-reveal>{crumbs}</nav>
    <div class="pdp__grid">
      <div class="pdp__media" data-reveal>
        <figure class="pdp__img" data-parallax>{img_html}</figure>
        <span class="pdp__cat-chip">{esc(p["category"])}</span>
      </div>
      <div class="pdp__info" data-reveal>
        <p class="eyebrow">{esc(p["category"])}</p>
        <h1 class="pdp__title">{esc(p["name"])}</h1>
        <div class="pdp__rating"><span class="stars">★★★★★</span><strong>4.9</strong><span class="muted">· 41 verified buyers</span></div>
        {price_html}
        {moq_html}
        <div class="pdp__ctas">
          <a class="btn btn--solid" href="tel:+917949095494">Get Best Quote</a>
          <a class="btn btn--ghost" href="tel:+917949095494">Call Us</a>
        </div>
        {chip_block}
        <div class="pdp__assure">
          <span>✦ In-house quality check</span>
          <span>✦ Manufacturer direct pricing</span>
          <span>✦ Customization available</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section pdp__details">
    <div class="pdp__details-grid">
      <div>
        <p class="eyebrow" data-reveal>Specifications</p>
        <h2 class="h2 h2--sm" data-reveal>Product Details</h2>
        {desc_block}
      </div>
      <div data-reveal>{spec_block}</div>
    </div>
  </section>

  <section class="section pdp__related">
    <div class="section__head">
      <p class="eyebrow" data-reveal>Keep exploring</p>
      <h2 class="h2 h2--sm" data-reveal>More {esc(p["category"])}</h2>
      <a href="../products.html#{p["anchor"]}" class="section__link" data-reveal>View all →</a>
    </div>
    <div class="rel__row">{related_html}</div>
  </section>
</main>
{FOOT}
{SCRIPTS.format(rel="../")}
"""


def render_catalog(cats):
    sections = []
    total = 0
    for cat_name, anchor, prods in cats:
        total += len(prods)
        cards = "".join(f'<div class="catcard" data-reveal>{rel_card(p, "")}</div>' for p in prods)
        sections.append(f"""
    <section class="catblock" id="{anchor}">
      <div class="catblock__head">
        <h2 class="h2 h2--sm" data-reveal>{esc(cat_name)}</h2>
        <span class="catblock__count" data-reveal>{len(prods)} style{"s" if len(prods) != 1 else ""}</span>
      </div>
      <div class="catblock__grid">{cards}</div>
    </section>""")

    jump = "".join(
        f'<a href="#{a}" class="catjump">{esc(n)}<span>{len(p)}</span></a>'
        for n, a, p in cats
    )

    return HEAD.format(
        title="Shop the Range — Namdev Textile",
        desc_meta="Browse the complete Namdev Textile range: Sanganeri, Jaipuri, Hand Block, Rajasthani, Ajrakh, Udaipuri, Cambric, Linen shirts and cotton fabric.",
        rel="",
    ) + f"""
{NAV.format(rel="")}
<div class="scroll-progress" id="scrollProgress"></div>
<main>
  <section class="cat-hero">
    <div class="hero__glow" aria-hidden="true"></div>
    <p class="eyebrow" data-reveal>The Complete Range</p>
    <h1 class="cat-hero__title"><span class="hero__line"><span>SHOP THE</span></span><span class="hero__line hero__line--outline"><span>COLLECTION</span></span></h1>
    <p class="cat-hero__sub" data-reveal>{total} handcrafted styles across {len(cats)} print traditions — manufacturer direct from Jaipur.</p>
    <div class="cat-hero__jump">{jump}</div>
  </section>
  {''.join(sections)}
</main>
{FOOT}
{SCRIPTS.format(rel="")}
"""


# ---------------------------------------------------------------- main
def main():
    used_slugs = set()
    all_products = []
    cats = []
    for file_slug, cat_name, anchor in CATEGORIES:
        path = os.path.join(TMP, f"nt-{file_slug}.txt")
        prods = parse_category(path, cat_name, anchor)
        for p in prods:
            p["slug"] = slugify(p["name"], used_slugs)
        cats.append((cat_name, anchor, prods))
        all_products.extend(prods)
        print(f"{cat_name}: {len(prods)}")

    print(f"TOTAL {len(all_products)}")
    download_images(all_products)

    by_cat = {}
    for _, anchor, prods in cats:
        for p in prods:
            by_cat.setdefault(anchor, []).append(p)

    for p in all_products:
        related = [q for q in by_cat[p["anchor"]] if q["slug"] != p["slug"]][:6]
        if len(related) < 4:  # pad with others
            related += [q for q in all_products if q["anchor"] != p["anchor"]][: 6 - len(related)]
        with open(os.path.join(PDP_DIR, f"{p['slug']}.html"), "w", encoding="utf-8") as f:
            f.write(render_pdp(p, related))

    with open(os.path.join(ROOT, "products.html"), "w", encoding="utf-8") as f:
        f.write(render_catalog(cats))

    with open(os.path.join(ROOT, "products.json"), "w", encoding="utf-8") as f:
        json.dump(all_products, f, indent=2, ensure_ascii=False)

    print("wrote", len(all_products), "PDPs + products.html")


if __name__ == "__main__":
    main()
