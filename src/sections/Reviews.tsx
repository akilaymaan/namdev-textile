import { motion } from 'framer-motion';

const fadeIn = (delay = 0) => ({
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  whileInView: { filter: 'blur(0px)', opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

const METRICS = [
  { label: 'Response', pct: 93 },
  { label: 'Quality', pct: 96 },
  { label: 'Delivery', pct: 96 },
];

const REVIEWS = [
  {
    name: 'Sudha Rai',
    text: 'The response is good. Quality of products is excellent. Delivered in good packing and quickly.',
    stars: 5,
  },
  {
    name: 'Jay Desai',
    text: 'Very understanding and ethical business.',
    stars: 5,
  },
  {
    name: 'Amit Kumar',
    text: 'Very good experience. Everyone must try at least once. Awesome shirt.',
    stars: 5,
  },
  {
    name: 'AJIL KRISHNAN AS',
    text: 'Best experience.',
    stars: 5,
  },
  {
    name: 'Ravi Ram Jawahar',
    text: 'Good.',
    stars: 4,
  },
  {
    name: 'SOORAJ',
    text: 'Great service — the team even replied with a personal thank you.',
    stars: 5,
  },
];

const Stars = ({ n }: { n: number }) => (
  <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => (
      <svg key={i} viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${i < n ? 'fill-white' : 'fill-white/25'}`}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

export default function Reviews() {
  return (
    <section id="reviews" className="relative bg-black overflow-hidden scroll-mt-24">
      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-20">
        <motion.p {...fadeIn(0)} className="text-sm font-body text-white/80 mb-6">
          {'// Reviews'}
        </motion.p>
        <motion.h2
          {...fadeIn(0.1)}
          className="font-heading italic text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-[-3px] text-white max-w-4xl"
        >
          Rated 4.9 by buyers
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* rating summary */}
          <motion.div {...fadeIn(0.15)} className="liquid-glass rounded-[1.25rem] p-6 flex flex-col">
            <div className="font-heading italic text-7xl md:text-8xl text-white tracking-[-3px] leading-none">4.9</div>
            <div className="mt-4">
              <Stars n={5} />
            </div>
            <p className="mt-3 text-sm text-white/80 font-body font-light">41 verified reviews</p>

            <div className="mt-auto pt-8 flex flex-col gap-4">
              {METRICS.map((m, i) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs text-white/80 font-body mb-2">
                    <span>{m.label}</span>
                    <span>{m.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-white/80"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* testimonials */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.blockquote
                key={r.name}
                {...fadeIn(0.15 + i * 0.08)}
                className="liquid-glass rounded-[1.25rem] p-6 flex flex-col m-0"
              >
                <Stars n={r.stars} />
                <p className="mt-4 text-sm md:text-base text-white font-body font-light leading-snug flex-1">
                  &ldquo;{r.text}&rdquo;
                </p>
                <footer className="mt-5 flex items-center gap-3">
                  <span className="liquid-glass h-9 w-9 rounded-full flex items-center justify-center font-heading italic text-base text-white">
                    {r.name.charAt(0)}
                  </span>
                  <span className="text-xs text-white/80 font-body">{r.name}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
