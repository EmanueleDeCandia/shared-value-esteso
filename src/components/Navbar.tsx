import { useEffect, useState } from 'react';
import { cn } from '../utils/cn';
import { Logo } from './ui';

const LINKS = [
  { href: '#modello', label: 'Modello' },
  { href: '#binari', label: 'Doppio Binario' },
  { href: '#partner', label: 'Partner' },
  { href: '#simulatore', label: 'Simulatore' },
  { href: '#impatto', label: 'Impatto' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-500', scrolled ? 'py-2' : 'py-4')}>
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <nav
          aria-label="Navigazione principale"
          className={cn(
            'relative flex items-center justify-between rounded-full px-5 py-2.5 text-cream transition-all duration-500',
            scrolled ? 'glass-dark shadow-[0_10px_40px_-20px_rgba(0,0,0,.8)]' : 'bg-transparent',
          )}
        >
          <Logo />

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="group hidden md:flex flex-col items-center justify-center gap-[6px] px-4 py-3"
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={open}
          >
            <span className={cn('block h-px w-10 bg-cream transition-all duration-300', open && 'translate-y-[3.5px] rotate-45')} />
            <span className={cn('block h-px w-10 bg-cream transition-all duration-300 group-hover:w-7', open && '-translate-y-[3.5px] -rotate-45 group-hover:w-10')} />
          </button>

          <ul className="hidden lg:flex items-center gap-7">
            {LINKS.slice(0, 4).map((l) => (
              <li key={l.href}>
                <a href={l.href} className="eyebrow relative py-2 text-cream/70 transition-colors hover:text-cream after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-cream after:transition-all after:duration-300 hover:after:w-full">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#simulatore"
              className="eyebrow hidden sm:inline-flex items-center rounded-full border border-cream/50 px-5 py-2.5 transition-all duration-300 hover:border-cream hover:bg-cream hover:text-ink"
            >
              Simulatore
            </a>
            <span className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full border border-cream/40" aria-hidden>
              <span className="h-3.5 w-3.5 rounded-full bg-[linear-gradient(90deg,#e9e6df_50%,transparent_50%)] border border-cream/70" />
            </span>
            <span className="eyebrow hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full border border-cream/40 text-[9px]" aria-label="Lingua italiana">
              IT
            </span>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="md:hidden flex flex-col items-center justify-center gap-[6px] px-2 py-3"
              aria-label={open ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={open}
            >
              <span className={cn('block h-px w-8 bg-cream transition-all duration-300', open && 'translate-y-[3.5px] rotate-45')} />
              <span className={cn('block h-px w-8 bg-cream transition-all duration-300', open && '-translate-y-[3.5px] -rotate-45')} />
            </button>
          </div>

          <span className="absolute -bottom-[1px] left-6 right-6 h-px overflow-hidden rounded-full bg-cream/10" aria-hidden>
            <span className="block h-full bg-azzurro-2 transition-transform duration-150 origin-left" style={{ transform: `scaleX(${progress})` }} />
          </span>
        </nav>
      </div>

      {/* Full-screen menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl transition-all duration-500',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!open}
      >
        <div className="mx-auto flex h-full max-w-[1440px] flex-col justify-center px-6 md:px-16">
          <ul className="space-y-2">
            {LINKS.map((l, i) => (
              <li key={l.href} style={{ transitionDelay: `${i * 60}ms` }} className={cn('transition-all duration-500', open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0')}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display group flex items-baseline gap-6 text-4xl sm:text-6xl lg:text-7xl text-cream/85 transition-colors hover:text-cream"
                >
                  <sup className="text-xs tracking-widest opacity-50 font-normal">0{i + 1}</sup>
                  <span className="relative">
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-cream transition-all duration-500 group-hover:w-full" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3 border-t border-cream/15 pt-6 text-cream/50 eyebrow">
            <span>Pilota — Unione dei Monti Azzurri</span>
            <span>Sviluppo — Regione Marche · 4 Province</span>
          </div>
        </div>
      </div>
    </header>
  );
}
