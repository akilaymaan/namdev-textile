import { ArrowUpRight } from './icons';

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="px-8 md:px-16 lg:px-20 py-10 flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="liquid-glass h-12 w-12 rounded-full flex items-center justify-center">
            <span className="font-heading italic text-2xl text-white">n</span>
          </span>
          <div>
            <div className="font-heading italic text-2xl text-white tracking-[-0.5px] leading-none">Namdev Textile</div>
            <div className="text-[11px] text-white/60 font-body mt-1">Heritage prints · Jaipur, since 2021</div>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-body text-white/80">
          <a href="/shop" className="hover:text-white transition-colors">Shop</a>
          <a href="/#capabilities" className="hover:text-white transition-colors">Craft</a>
          <a href="/#about" className="hover:text-white transition-colors">About</a>
          <a href="/#reviews" className="hover:text-white transition-colors">Reviews</a>
          <a href="/#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <a
          href="tel:+917949095494"
          className="liquid-glass rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-white font-body w-fit"
        >
          +91 79490 95494 <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div className="px-8 md:px-16 lg:px-20 pb-8 text-[11px] text-white/40 font-body flex flex-wrap gap-x-6 gap-y-2">
        <span>© {new Date().getFullYear()} Namdev Textile</span>
        <span>GST 08CIGPC2551L1Z9</span>
        <span>IEC CIGPC2551L</span>
      </div>
    </footer>
  );
}
