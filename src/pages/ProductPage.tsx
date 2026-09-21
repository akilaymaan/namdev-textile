import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TextileBackdrop from '../components/TextileBackdrop';
import ProductCard from '../components/ProductCard';
import { ArrowUpRight } from '../components/icons';
import { CATEGORY_LABEL, getProduct, productImg, relatedProducts } from '../data/products';

const fadeIn = (delay = 0) => ({
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

export default function ProductPage({ slug }: { slug: string }) {
  const product = getProduct(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) document.title = `${product.name} — Namdev Textile`;
  }, [slug, product]);

  if (!product) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="px-8 md:px-16 pt-48 pb-32 text-center">
          <h1 className="font-heading italic text-6xl text-white tracking-[-2px]">Not found</h1>
          <p className="mt-4 text-sm text-white/80 font-body">That product isn&rsquo;t in our range.</p>
          <a href="/shop" className="mt-8 inline-flex liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white font-body">
            Browse the collection
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const specs = Object.entries(product.details ?? {});
  const related = relatedProducts(product);
  const topSpecs = specs.slice(0, 4);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="relative overflow-hidden">
        <TextileBackdrop variant="focus" image={productImg(product)} />
        <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-32 pb-10">
        {/* breadcrumb */}
        <motion.nav {...fadeIn(0)} className="text-xs font-body text-white/60 flex flex-wrap gap-2 mb-10">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-white transition-colors">Shop</a>
          <span>/</span>
          <a href={`/shop#${product.anchor}`} className="hover:text-white transition-colors">
            {CATEGORY_LABEL[product.anchor] ?? product.category}
          </a>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* image */}
          <motion.div {...fadeIn(0.05)} className="liquid-glass rounded-[1.25rem] p-3">
            <div className="rounded-[0.9rem] overflow-hidden bg-white/5">
              {productImg(product) && (
                <img src={productImg(product)} alt={product.name} className="w-full h-auto object-cover" />
              )}
            </div>
          </motion.div>

          {/* info */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            <motion.div {...fadeIn(0.1)}>
              <div className="text-[11px] uppercase tracking-[0.15em] text-white/60 font-body">
                {CATEGORY_LABEL[product.anchor] ?? product.category}
              </div>
              <h1 className="mt-2 font-heading italic text-4xl md:text-5xl lg:text-6xl text-white tracking-[-2px] leading-[0.95]">
                {product.name}
              </h1>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-white/70 font-body">4.9 · 41 reviews</span>
              </div>
            </motion.div>

            <motion.div {...fadeIn(0.2)} className="liquid-glass rounded-[1.25rem] p-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-heading italic text-5xl md:text-6xl text-white tracking-[-2px] leading-none">
                  ₹{product.price ?? '—'}
                </span>
                <span className="text-sm text-white/60 font-body">per {product.unit || 'Piece'}</span>
              </div>
              {product.moq && (
                <p className="mt-2 text-xs text-white/70 font-body">Minimum order: {product.moq}</p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="tel:+917949095494"
                  className="liquid-glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-white font-body"
                >
                  Get Best Quote <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="/#contact"
                  className="flex items-center gap-2 text-sm font-medium text-white/90 font-body px-2 py-2.5"
                >
                  Send Enquiry
                </a>
              </div>

              {topSpecs.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {topSpecs.map(([k, v]) => (
                    <span key={k} className="liquid-glass rounded-full px-3 py-1.5 text-[11px] text-white/90 font-body whitespace-nowrap">
                      {k}: {v}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* details */}
        {(specs.length > 0 || product.desc) && (
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {specs.length > 0 && (
              <motion.div {...fadeIn(0)} className="liquid-glass rounded-[1.25rem] p-6">
                <h2 className="font-heading italic text-3xl text-white tracking-[-1px] mb-5">Product Details</h2>
                <dl className="flex flex-col">
                  {specs.map(([k, v]) => (
                    <div key={k} className="flex gap-4 py-3 border-b border-white/10 last:border-0">
                      <dt className="w-2/5 text-xs text-white/60 font-body">{k}</dt>
                      <dd className="flex-1 text-sm text-white font-body font-light">{v}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            )}
            {product.desc && (
              <motion.div {...fadeIn(0.1)} className="liquid-glass rounded-[1.25rem] p-6">
                <h2 className="font-heading italic text-3xl text-white tracking-[-1px] mb-5">About this piece</h2>
                <p className="text-sm md:text-base text-white/80 font-body font-light leading-relaxed whitespace-pre-line">
                  {product.desc}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* related */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between gap-4 mb-8 pt-8 border-t border-white/10">
              <h2 className="font-heading italic text-4xl md:text-5xl text-white tracking-[-2px] leading-none">
                More {CATEGORY_LABEL[product.anchor] ?? product.category}
              </h2>
              <a href={`/shop#${product.anchor}`} className="text-xs font-body text-white/70 hover:text-white transition-colors whitespace-nowrap">
                View all →
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.slice(0, 4).map((p, i) => (
                <ProductCard key={p.slug} p={p} delay={i * 0.06} />
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
