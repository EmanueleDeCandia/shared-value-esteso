import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { cn } from '../utils/cn';

/* ------------------------------------------------------------------ */
/* Reveal on scroll (IntersectionObserver, staggered via delay)        */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = Tag as unknown as 'div';
  return (
    <Comp
      ref={ref as never}
      className={cn('reveal', inView && 'in', className)}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* Count-up number                                                     */
/* ------------------------------------------------------------------ */
export function CountUp({
  to,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1600,
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) {
      setVal(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          setVal(to * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return (
    <span ref={ref} className={cn('tabular', className)}>
      {prefix}
      {new Intl.NumberFormat('it-IT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(val)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee strip between thin rules (reference style)                  */
/* ------------------------------------------------------------------ */
export function Marquee({
  text,
  className,
  slow = false,
  textClass,
}: {
  text: string;
  className?: string;
  slow?: boolean;
  textClass?: string;
}) {
  const content = Array.from({ length: 6 }, () => text).join('   ·   ');
  return (
    <div className={cn('relative overflow-hidden border-y border-current/15 py-3 md:py-4', className)} aria-hidden>
      <div className={cn('flex w-max whitespace-nowrap', slow ? 'animate-marquee-slow' : 'animate-marquee')}>
        <span className={cn('pr-8 text-lg md:text-2xl font-light tracking-tight', textClass)}>{content}</span>
        <span className={cn('pr-8 text-lg md:text-2xl font-light tracking-tight', textClass)}>{content}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Numbered strip: "1. Item | 2. Item"                                  */
/* ------------------------------------------------------------------ */
export function NumberedStrip({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-y-3 border-b border-current/15 py-4', className)}>
      {items.map((it, i) => (
        <div key={it} className="flex items-center">
          <span className="text-sm md:text-base">
            <sup className="mr-1 text-[9px] opacity-60">{i + 1}.</sup>
            {it}
          </span>
          {i < items.length - 1 && <span className="mx-4 h-4 w-px bg-current/25 md:mx-7" aria-hidden />}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section header                                                      */
/* ------------------------------------------------------------------ */
export function SectionHead({
  eyebrow,
  title,
  titleLine2,
  lead,
  dark = false,
  number,
  className,
}: {
  eyebrow: string;
  title: string;
  titleLine2?: string;
  lead?: ReactNode;
  dark?: boolean;
  number?: string;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-8 md:grid-cols-12 md:items-end', className)}>
      <div className="md:col-span-8">
        <Reveal>
          <div className={cn('eyebrow mb-6 flex items-center gap-3', dark ? 'text-cream/60' : 'text-ink/55')}>
            <span className="h-px w-8 bg-current" />
            {eyebrow}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className={cn('display display-indent text-[2.6rem] sm:text-6xl lg:text-7xl', dark ? 'text-cream' : 'text-ink')}>
            <span>{title}</span>
            {titleLine2 && <span>{titleLine2}</span>}
          </h2>
        </Reveal>
      </div>
      <div className="md:col-span-4 flex items-end justify-between md:justify-end gap-6">
        {lead && (
          <Reveal delay={160}>
            <p className={cn('max-w-sm text-sm md:text-[15px] leading-relaxed', dark ? 'text-cream/70' : 'text-ink/65')}>{lead}</p>
          </Reveal>
        )}
        {number && (
          <Reveal delay={200}>
            <span
              className={cn(
                'hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full border text-[11px] tabular',
                dark ? 'border-cream/30 text-cream/70' : 'border-ink/30 text-ink/60',
              )}
            >
              {number}
            </span>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */
export function PillButton({
  children,
  href,
  onClick,
  variant = 'solid',
  dark = false,
  className,
  type = 'button',
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline';
  dark?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const base =
    'group relative inline-flex items-center gap-3 rounded-full px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-all duration-300 overflow-hidden';
  const solid = dark
    ? 'bg-cream text-ink hover:bg-white'
    : 'bg-ink text-cream hover:bg-black';
  const outline = dark
    ? 'border border-cream/40 text-cream hover:border-cream hover:bg-cream/5'
    : 'border border-ink/30 text-ink hover:border-ink hover:bg-ink/5';
  const cls = cn(base, variant === 'solid' ? solid : outline, className);
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <svg className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </>
  );
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return <button type={type} onClick={onClick} className={cls}>{inner}</button>;
}

export function Logo({ dark = true, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label="Shared Value Esteso — home">
      <span className={cn('relative inline-flex h-9 w-9 items-center justify-center rounded-full border', dark ? 'border-cream/80' : 'border-ink/80')}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 4 20 19H4L12 4Z" strokeLinejoin="round" />
          <path d="M9 14h6" />
        </svg>
        <span className="absolute inset-0 rounded-full border border-azzurro/0 animate-pulse-soft" style={{ borderColor: 'rgba(95,134,179,.5)' }} aria-hidden />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight">shared value</span>
          <span className="eyebrow mt-1 opacity-60">esteso · marche</span>
        </span>
      )}
    </a>
  );
}
