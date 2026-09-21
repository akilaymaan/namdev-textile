import { motion } from 'framer-motion';
import { CATEGORY_LABEL, productImg, type Product } from '../data/products';

export default function ProductCard({ p, delay = 0 }: { p: Product; delay?: number }) {
  return (
    <motion.a
      href={`/product/${p.slug}`}
      initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
      whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className="liquid-glass rounded-[1.25rem] p-3 flex flex-col group"
    >
      <div className="rounded-[0.9rem] overflow-hidden aspect-[3/4] bg-white/5">
        {productImg(p) && (
          <img
            src={productImg(p)}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
          />
        )}
      </div>
      <div className="px-2 pt-4 pb-2 flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-body">
          {CATEGORY_LABEL[p.anchor] ?? p.category}
        </span>
        <h3 className="text-sm md:text-base text-white font-body font-medium leading-snug line-clamp-2">{p.name}</h3>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <span className="font-heading italic text-xl text-white tracking-[-0.5px]">
            ₹{p.price ?? '—'}
            <span className="text-xs text-white/50 font-body not-italic">/{p.unit || 'Piece'}</span>
          </span>
          {p.moq && <span className="text-[10px] text-white/50 font-body whitespace-nowrap">MOQ {p.moq}</span>}
        </div>
      </div>
    </motion.a>
  );
}
