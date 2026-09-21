import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { PRODUCTS, productImg } from '../data/products';

const IMGS = PRODUCTS.map(productImg).filter(Boolean);

// deterministic pseudo-shuffle so columns mix print traditions
const hash = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
};
const SHUFFLED = [...IMGS].sort((a, b) => (hash(a) % 89) - (hash(b) % 89));

const pick = (n: number, mod: number, take: number) =>
  SHUFFLED.filter((_, i) => i % mod === n).slice(0, take);

const SPRING = { stiffness: 55, damping: 22, mass: 0.7 };

function Column({
  imgs,
  progress,
  dir,
  duration,
  range,
  className = '',
}: {
  imgs: string[];
  progress: MotionValue<number>;
  dir: 'up' | 'down';
  duration: number;
  range: [number, number];
  className?: string;
}) {
  const y = useSpring(useTransform(progress, [0, 1], range), SPRING);
  return (
    <motion.div style={{ y }} className={`flex-1 min-w-0 ${className}`}>
      <div className={dir === 'up' ? 'textile-up' : 'textile-down'} style={{ animationDuration: `${duration}s` }}>
        {[...imgs, ...imgs].map((src, i) => (
          <div key={i} className="rounded-[1rem] overflow-hidden aspect-[3/4] mb-5 bg-white/5">
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover brightness-[0.7] saturate-[0.85]"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Row({
  imgs,
  progress,
  dir,
  duration,
  range,
}: {
  imgs: string[];
  progress: MotionValue<number>;
  dir: 'left' | 'right';
  duration: number;
  range: [number, number];
}) {
  const x = useSpring(useTransform(progress, [0, 1], range), SPRING);
  return (
    <motion.div style={{ x }} className="w-max">
      <div
        className={`flex gap-5 w-max ${dir === 'left' ? 'textile-left' : 'textile-right'}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[...imgs, ...imgs].map((src, i) => (
          <div key={i} className="w-64 md:w-80 aspect-[4/3] rounded-[1rem] overflow-hidden bg-white/5 shrink-0">
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover brightness-[0.65] saturate-[0.8]"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function TextileBackdrop({
  variant = 'columns',
  dim = false,
  fixed = false,
  image,
}: {
  variant?: 'columns' | 'rows' | 'focus';
  /** heavier overlay — use behind dense content */
  dim?: boolean;
  /** pin behind the whole page (uses global scroll progress) */
  fixed?: boolean;
  /** single image for the 'focus' variant (blurred, slow zoom) */
  image?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const local = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const global = useScroll();
  const scrollYProgress = fixed ? global.scrollYProgress : local.scrollYProgress;

  return (
    <div
      ref={ref}
      className={`${fixed ? 'fixed' : 'absolute'} inset-0 z-0 overflow-hidden`}
      aria-hidden="true"
    >
      {variant === 'focus' ? (
        /* single product image — blurred, slowly zooming, scroll parallax */
        <FocusImage src={image ?? ''} progress={scrollYProgress} />
      ) : variant === 'columns' ? (
        <div className="absolute -inset-[22%] rotate-[-5deg] flex gap-4 md:gap-6">
          <Column imgs={pick(0, 4, 9)} progress={scrollYProgress} dir="up" duration={48} range={[40, -140]} />
          <Column imgs={pick(1, 4, 9)} progress={scrollYProgress} dir="down" duration={62} range={[-60, 120]} />
          <Column imgs={pick(2, 4, 9)} progress={scrollYProgress} dir="up" duration={54} range={[20, -100]} />
          <Column
            imgs={pick(3, 4, 9)}
            progress={scrollYProgress}
            dir="down"
            duration={70}
            range={[-40, 150]}
            className="hidden md:block"
          />
        </div>
      ) : (
        <div className="absolute -inset-[18%] rotate-[3deg] flex flex-col justify-center gap-6">
          <Row imgs={pick(0, 4, 10)} progress={scrollYProgress} dir="left" duration={58} range={[-80, 80]} />
          <Row imgs={pick(1, 4, 10)} progress={scrollYProgress} dir="right" duration={72} range={[60, -100]} />
          <Row imgs={pick(2, 4, 10)} progress={scrollYProgress} dir="left" duration={64} range={[-50, 60]} />
          <Row imgs={pick(3, 4, 10)} progress={scrollYProgress} dir="right" duration={80} range={[40, -70]} />
        </div>
      )}

      {/* drifting block-print motif */}
      <div className="blockprint absolute inset-0 opacity-[0.06]" />

      {/* readability overlays */}
      {dim && <div className="absolute inset-0 bg-black/60" />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 85% 60% at 50% 45%, transparent 25%, rgba(0,0,0,0.55) 100%)' }}
      />
    </div>
  );
}

function FocusImage({ src, progress }: { src: string; progress: MotionValue<number> }) {
  const y = useSpring(useTransform(progress, [0, 1], [60, -60]), SPRING);
  return (
    <motion.div style={{ y }} className="absolute -inset-[12%]">
      <div className="kenburns w-full h-full">
        {src && (
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover blur-2xl brightness-[0.55] saturate-[0.9] scale-110"
          />
        )}
      </div>
    </motion.div>
  );
}
