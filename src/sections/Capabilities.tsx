import { motion } from 'framer-motion';
import TextileBackdrop from '../components/TextileBackdrop';
import { ImageIcon, MovieIcon, LightbulbIcon } from '../components/icons';
import type { ComponentType } from 'react';

interface Capability {
  icon: ComponentType<{ className?: string }>;
  title: string;
  tags: string[];
  body: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: ImageIcon,
    title: 'Print Traditions',
    tags: ['Sanganeri', 'Jaipuri', 'Hand Block', 'Ajrakh'],
    body: "Authentic Rajasthani prints that carry centuries of hand-craft heritage — every shirt cut from honest cotton and finished with a modern eye.",
  },
  {
    icon: MovieIcon,
    title: 'Manufacturing',
    tags: ['In-House QC', 'Advanced Setup', 'Bulk Orders', 'Warehouse'],
    body: 'A modern Jaipur unit with skilled artisans and strict in-house quality control — every garment checked for design, durability and finish before it ships.',
  },
  {
    icon: LightbulbIcon,
    title: 'Partnership',
    tags: ['Wholesale', 'Retail', 'Customization', 'On-Time'],
    body: 'We build long-term relationships with retailers, wholesalers and end customers — through trust, transparency and consistent product quality.',
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative min-h-screen overflow-hidden bg-black">
      {/* animated textile backdrop */}
      <TextileBackdrop variant="rows" />

      {/* content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-16 flex flex-col min-h-screen">
        {/* header */}
        <div className="mb-auto">
          <motion.p
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-sm font-body text-white/80 mb-6"
          >
            {'// Capabilities'}
          </motion.p>
          <motion.h2
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="font-heading italic text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px] text-white"
          >
            Heritage craft,<br />loom to label
          </motion.h2>
        </div>

        {/* cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col"
                initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
                whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: 'easeOut' }}
              >
                {/* top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {cap.tags.map((tag) => (
                      <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1" />

                {/* bottom */}
                <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none text-white">
                  {cap.title}
                </h3>
                <p className="mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                  {cap.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
