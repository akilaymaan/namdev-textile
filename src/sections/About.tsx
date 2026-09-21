import { motion } from 'framer-motion';
import { ArrowUpRight } from '../components/icons';
import TextileBackdrop from '../components/TextileBackdrop';

const fadeIn = (delay = 0) => ({
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  whileInView: { filter: 'blur(0px)', opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

const FACTS = [
  ['Manufacturer', 'Wholesale & Retail'],
  ['Est. 2021', 'Jaipur, Rajasthan'],
  ['Proprietorship', 'GST 08CIGPC2551L1Z9'],
  ['Export Ready', 'IEC CIGPC2551L'],
];

const PILLARS = [
  {
    title: 'Vision',
    body: 'To be recognised as a leader in ethnic menswear — preserving Rajasthan\u2019s textile heritage while elevating quality, design, and the artisans behind every garment.',
  },
  {
    title: 'Mission',
    body: 'Deliver high-quality, culturally inspired shirts through craftsmanship, eco-friendly and ethical practices, and transparent long-term partnerships.',
  },
  {
    title: 'Why Us',
    body: 'Authentic Rajasthani prints, skilled craftsmanship, in-house quality control, advanced manufacturing, and a customer-centric approach.',
  },
];

export default function About() {
  return (
    <section id="about" className="relative bg-black overflow-hidden scroll-mt-24">
      <TextileBackdrop variant="rows" dim />
      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-20">
        <motion.p {...fadeIn(0)} className="text-sm font-body text-white/80 mb-6">
          {'// The Studio'}
        </motion.p>
        <motion.h2
          {...fadeIn(0.1)}
          className="font-heading italic text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-[-3px] text-white max-w-4xl"
        >
          A Jaipur print house, since 2021
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* image panel */}
          <motion.div
            {...fadeIn(0.15)}
            className="liquid-glass rounded-[1.25rem] p-3 relative h-[320px] md:h-[400px] lg:h-auto lg:min-h-[420px]"
          >
            <img
              src="/img/infra-manufacturing.jpg"
              alt="Namdev Textile manufacturing unit"
              className="w-full h-full object-cover rounded-[0.9rem]"
            />
            <div className="liquid-glass rounded-[0.9rem] absolute bottom-6 left-6 px-4 py-3">
              <div className="font-heading italic text-3xl text-white leading-none tracking-[-1px]">4.9/5</div>
              <div className="text-[11px] text-white/80 font-body mt-1">rated by 41 buyers</div>
            </div>
          </motion.div>

          {/* copy + facts */}
          <div className="flex flex-col gap-6">
            <motion.div {...fadeIn(0.2)} className="liquid-glass rounded-[1.25rem] p-6 flex-1">
              <p className="text-base md:text-lg text-white font-body font-light leading-snug">
                We, <span className="font-medium">Namdev Textile</span>, are the leading manufacturer, wholesaler and
                retailer of Men Jaipuri Print Shirts, Hand Block Print Shirts, Rajasthani Printed Shirts, Sanganeri
                Printed Shirts and more — since <span className="font-medium">2021</span> in Jaipur, Rajasthan.
              </p>
              <p className="mt-4 text-sm text-white/80 font-body font-light leading-relaxed">
                Supported by an adroit team of professionals and an advanced manufacturing setup, every garment passes
                through a fully functional in-house quality-control unit before it reaches you. The company is led by
                CEO <span className="font-medium">Yogesh Kumar Choudhary</span>.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {FACTS.map(([k, v], i) => (
                <motion.div key={k} {...fadeIn(0.25 + i * 0.08)} className="liquid-glass rounded-[1.25rem] p-4">
                  <div className="font-heading italic text-xl md:text-2xl text-white tracking-[-0.5px] leading-tight">
                    {k}
                  </div>
                  <div className="text-[11px] md:text-xs text-white/80 font-body mt-1">{v}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* pillars */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <motion.div key={p.title} {...fadeIn(0.2 + i * 0.1)} className="liquid-glass rounded-[1.25rem] p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading italic text-2xl md:text-3xl text-white tracking-[-1px] leading-none">
                  {p.title}
                </h3>
                <span className="liquid-glass h-9 w-9 rounded-[0.6rem] flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-white/90" />
                </span>
              </div>
              <p className="mt-4 text-sm text-white/80 font-body font-light leading-snug">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
