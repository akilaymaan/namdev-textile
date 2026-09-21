import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from '../components/icons';

const fadeIn = (delay = 0) => ({
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  whileInView: { filter: 'blur(0px)', opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

const DETAILS = [
  ['Contact Person', 'Yogesh Kumar Choudhary (CEO)'],
  ['Phone', '+91-7949095494'],
  ['Address', '3050, Jaat Ke Kuve Ka Rasta, Jaipur - 302001, Rajasthan, India'],
  ['GST', '08CIGPC2551L1Z9'],
  ['IEC', 'CIGPC2551L'],
];

const inputCls =
  'w-full rounded-[0.75rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white font-body font-light placeholder:text-white/40 outline-none focus:border-white/25 focus:bg-white/[0.06] transition-colors';

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative bg-black overflow-hidden scroll-mt-24">
      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-16">
        <motion.p {...fadeIn(0)} className="text-sm font-body text-white/80 mb-6">
          {'// Contact'}
        </motion.p>
        <motion.h2
          {...fadeIn(0.1)}
          className="font-heading italic text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-[-3px] text-white max-w-4xl"
        >
          Tell us your requirement
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* details */}
          <motion.div {...fadeIn(0.15)} className="liquid-glass rounded-[1.25rem] p-6 flex flex-col gap-5">
            {DETAILS.map(([k, v]) => (
              <div key={k}>
                <div className="text-[11px] uppercase tracking-[0.15em] text-white/60 font-body">{k}</div>
                <div className="mt-1 text-sm md:text-base text-white font-body font-light leading-snug">{v}</div>
              </div>
            ))}
            <div className="mt-auto pt-4 flex flex-wrap gap-3">
              <a
                href="tel:+917949095494"
                className="liquid-glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-white font-body"
              >
                Call Now <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=3050+Jaat+Ke+Kuve+Ka+Rasta+Jaipur+302001"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-white/90 font-body px-2 py-2.5"
              >
                Get Directions
              </a>
            </div>
          </motion.div>

          {/* enquiry form */}
          <motion.div {...fadeIn(0.25)} className="liquid-glass rounded-[1.25rem] p-6 relative overflow-hidden">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Your name" className={inputCls} />
                <input required placeholder="Phone" type="tel" className={inputCls} />
              </div>
              <input placeholder="Email (optional)" type="email" className={inputCls} />
              <textarea
                required
                placeholder="What would you like to order? (e.g. 100 pcs Sanganeri shirts, size M–XL)"
                rows={5}
                className={`${inputCls} resize-none`}
              />
              <button
                type="submit"
                className="liquid-glass-strong rounded-full px-5 py-3 flex items-center justify-center gap-2 text-sm font-medium text-white font-body"
              >
                Send Enquiry <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>

            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="font-heading italic text-4xl text-white tracking-[-1px]">Thank you</div>
                  <p className="mt-3 text-sm text-white/80 font-body font-light max-w-[32ch]">
                    Our team will reach out shortly. For urgent orders, call +91-7949095494.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 liquid-glass rounded-full px-5 py-2.5 text-sm font-medium text-white font-body"
                  >
                    Send another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
