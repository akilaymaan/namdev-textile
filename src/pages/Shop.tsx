import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, CATEGORY_LABEL, PRODUCTS } from '../data/products';

const fadeIn = (delay = 0) => ({
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

export default function Shop() {
  useEffect(() => {
    document.title = 'Shop the Collection — Namdev Textile';
  }, []);
  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="px-8 md:px-16 lg:px-20 pt-36 pb-10">
        <motion.p {...fadeIn(0)} className="text-sm font-body text-white/80 mb-6">
          {'// The Range'}
        </motion.p>
        <motion.h1
          {...fadeIn(0.1)}
          className="font-heading italic text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px] text-white"
        >
          Shop the Collection
        </motion.h1>
        <motion.p {...fadeIn(0.25)} className="mt-4 text-sm md:text-base text-white/80 font-body font-light max-w-2xl">
          {PRODUCTS.length} designs across {CATEGORIES.length} print traditions — manufactured in Jaipur and shipped
          wholesale &amp; retail across India.
        </motion.p>

        {/* category jump pills */}
        <motion.div {...fadeIn(0.35)} className="mt-10 flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <a
              key={c.anchor}
              href={`#${c.anchor}`}
              className="liquid-glass rounded-full px-4 py-2 text-xs font-body text-white/90 whitespace-nowrap"
            >
              {CATEGORY_LABEL[c.anchor]}
              <span className="ml-2 text-white/50">{c.products.length}</span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* category sections */}
      {CATEGORIES.map((c) => (
        <section key={c.anchor} id={c.anchor} className="px-8 md:px-16 lg:px-20 pb-16 scroll-mt-24">
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex items-end justify-between gap-4 mb-8 pt-8 border-t border-white/10"
          >
            <h2 className="font-heading italic text-4xl md:text-5xl text-white tracking-[-2px] leading-none">
              {CATEGORY_LABEL[c.anchor]}
            </h2>
            <span className="liquid-glass rounded-full px-3.5 py-1.5 text-[11px] font-body text-white/80 whitespace-nowrap">
              {c.products.length} {c.products.length === 1 ? 'design' : 'designs'}
            </span>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {c.products.map((p, i) => (
              <ProductCard key={p.slug} p={p} delay={Math.min(i % 5, 4) * 0.06} />
            ))}
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
