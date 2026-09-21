import { motion } from 'framer-motion';
import TextileBackdrop from '../components/TextileBackdrop';
import BlurText from '../components/BlurText';
import Navbar from '../components/Navbar';
import { ArrowUpRight, Play, ClockIcon, GlobeIcon } from '../components/icons';

const fadeUp = (delay: number) => ({
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* animated textile backdrop */}
      <TextileBackdrop variant="columns" />

      {/* content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* main content */}
        <div className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center">
          {/* badge */}
          <motion.div {...fadeUp(0.4)} className="liquid-glass rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-2.5">
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-black font-body">New</span>
            <span className="text-xs md:text-sm text-white/90 font-body">Booking 2026 wholesale &amp; custom orders — limited capacity</span>
          </motion.div>

          {/* headline */}
          <h1 className="mt-6 max-w-3xl">
            <BlurText
              text="Heritage Prints Crafted to Outlast Trends"
              className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] tracking-[-4px]"
            />
          </h1>

          {/* subtext */}
          <motion.p {...fadeUp(0.8)} className="mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight">
            We are Namdev Textile — a Jaipur house of makers and printers shaping Jaipuri, Sanganeri and
            hand-block shirts for retailers, wholesalers and everyday wardrobes. Generational craft,
            honest cotton, and quality you can feel.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(1.1)} className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a href="/shop" className="liquid-glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-white font-body">
              Get a Quote <ArrowUpRight className="w-4 h-4" />
            </a>
            <a href="/shop" className="flex items-center gap-2 text-sm font-medium text-white/90 font-body">
              <Play className="w-4 h-4" /> Explore the Range
            </a>
          </motion.div>

          {/* stats */}
          <motion.div {...fadeUp(1.3)} className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="liquid-glass p-4 md:p-5 w-[220px] max-w-[46vw] rounded-[1.25rem] text-left">
              <ClockIcon className="w-6 h-6 text-white/80" />
              <p className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">Est. 2021</p>
              <p className="mt-2 text-[13px] text-white/80 font-body font-light leading-snug">Manufacturing in Jaipur, Rajasthan</p>
            </div>
            <div className="liquid-glass p-4 md:p-5 w-[220px] max-w-[46vw] rounded-[1.25rem] text-left">
              <GlobeIcon className="w-6 h-6 text-white/80" />
              <p className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">107+</p>
              <p className="mt-2 text-[13px] text-white/80 font-body font-light leading-snug">Designs across ten print traditions</p>
            </div>
          </motion.div>
        </div>

        {/* bottom trust bar */}
        <motion.div {...fadeUp(1.4)} className="flex flex-col items-center gap-4 pb-8 px-4">
          <div className="liquid-glass rounded-full px-5 py-2 text-xs md:text-sm text-white/90 font-body">
            Trusted by retailers, wholesalers and customers across India
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 md:gap-x-16 text-white/90">
            {['Sanganeri', 'Jaipuri', 'Ajrakh', 'Bagru', 'Udaipuri'].map((name) => (
              <span key={name} className="font-heading italic text-xl md:text-3xl tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
