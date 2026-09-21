import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, MenuIcon, CloseIcon } from './icons';

const LINKS: { label: string; href: string }[] = [
  { label: 'Shop', href: '/shop' },
  { label: 'Craft', href: '/#capabilities' },
  { label: 'About', href: '/#about' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex items-start justify-between px-8 lg:px-16">
      <a href="/" className="liquid-glass glass-nav h-12 w-12 rounded-full flex items-center justify-center shrink-0">
        <span className="font-heading italic text-2xl text-white">n</span>
      </a>

      <nav className="hidden md:flex liquid-glass glass-nav rounded-full px-1.5 py-1.5 items-center">
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} className="px-3 py-2 text-sm font-medium text-white/90 font-body">
            {l.label}
          </a>
        ))}
        <a
          href="/shop"
          className="ml-1 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black font-body"
        >
          Get a Quote <ArrowUpRight className="w-4 h-4" />
        </a>
      </nav>

      {/* mobile menu button */}
      <div className="md:hidden relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="liquid-glass glass-nav h-12 w-12 rounded-full flex items-center justify-center text-white"
        >
          {open ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ filter: 'blur(10px)', opacity: 0, y: -8 }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              exit={{ filter: 'blur(10px)', opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="liquid-glass-strong absolute right-0 top-14 w-56 rounded-[1.25rem] p-2 flex flex-col"
            >
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-white/90 font-body rounded-[0.75rem] hover:bg-white/5 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="/shop"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black font-body"
              >
                Get a Quote <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-12 w-12 hidden md:block" />
    </header>
  );
}
