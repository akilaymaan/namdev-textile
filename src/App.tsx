import { useEffect, useState } from 'react';
import Hero from './sections/Hero';
import Capabilities from './sections/Capabilities';
import About from './sections/About';
import Reviews from './sections/Reviews';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';

function usePathname() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);

    // intercept same-origin nav so SPA transitions work without reload
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
      if (href.startsWith('/')) {
        e.preventDefault();
        const [to, hash] = href.split('#');
        window.history.pushState({}, '', href);
        setPath(window.location.pathname);
        if (hash) {
          setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 80);
        } else if (to !== path) {
          window.scrollTo(0, 0);
        }
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, [path]);
  return path;
}

function Landing() {
  useEffect(() => {
    document.title = 'Namdev Textile — Heritage Prints from Jaipur';
  }, []);
  return (
    <>
      <Hero />
      <Capabilities />
      <About />
      <Reviews />
      <Contact />
      <Footer />
    </>
  );
}

export default function App() {
  const path = usePathname();

  if (path === '/shop') return <Shop />;
  if (path.startsWith('/product/')) return <ProductPage slug={path.slice('/product/'.length)} />;
  return <Landing />;
}
