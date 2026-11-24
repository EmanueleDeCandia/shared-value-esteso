import { useEffect, useRef } from 'react';
import { Marquee, NumberedStrip, PillButton, Reveal } from './ui';

const PARTNER_STRIP = ['Unioni di Comuni', 'Regione Marche', 'Aziende Pubbliche', 'Fondazione Bancaria', 'Imprese CSR', 'Imprese Shared Value'];

/* Rete ambientale: 6 nodi in orbita attorno all'Hub, corde che pulsano */
function AmbientNetwork() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = svg.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        svg.style.transform = `translate3d(${x * 14}px, ${y * 14}px, 0)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  const R = 190;
  const nodes = Array.from({ length: 6 }, (_, i) => {
    const a = (-Math.PI / 2) + (i * Math.PI * 2) / 6;
    return { x: 260 + R * Math.cos(a), y: 260 + R * Math.sin(a) };
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 520"
      className="h-full w-full transition-transform duration-700 ease-out"
      aria-hidden
    >
      <defs>
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8fb0d6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8fb0d6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="260" cy="260" r="120" fill="url(#hubGlow)" className="animate-pulse-soft" />
      <circle cx="260" cy="260" r={R} fill="none" stroke="#e9e6df" strokeOpacity="0.12" strokeDasharray="2 6" />
      <circle cx="260" cy="260" r={R + 40} fill="none" stroke="#e9e6df" strokeOpacity="0.06" />
      {/* corde molti-a-molti */}
      {nodes.map((a, i) =>
        nodes.map((b, j) =>
          i < j ? (
            <path
              key={`${i}-${j}`}
              d={`M${a.x},${a.y} Q260,260 ${b.x},${b.y}`}
              fill="none"
              stroke="#8fb0d6"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
          ) : null,
        ),
      )}
      {/* raggi verso hub con dash animata */}
      {nodes.map((n, i) => (
        <g key={i}>
          <line x1={n.x} y1={n.y} x2="260" y2="260" stroke="#e9e6df" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 8" className="animate-dash" style={{ animationDelay: `${i * 0.3}s` }} />
          <circle cx={n.x} cy={n.y} r="16" fill="#121212" stroke="#e9e6df" strokeOpacity="0.5" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fill="#e9e6df" fillOpacity="0.8" fontFamily="JetBrains Mono, monospace">{i + 1}</text>
        </g>
      ))}
      <circle cx="260" cy="260" r="26" fill="#e9e6df" />
      <path d="M260 249l9 17h-18l9-17z" fill="#121212" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink text-cream grain">
      {/* ambient gradients */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[36rem] w-[36rem] rounded-full bg-azzurro/15 blur-[140px] animate-float" aria-hidden />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-azzurro-2/10 blur-[140px] animate-float" style={{ animationDelay: '-4s' }} aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(#e9e6df 1px, transparent 1px), linear-gradient(90deg, #e9e6df 1px, transparent 1px)', backgroundSize: '96px 96px' }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1440px] px-6 pt-36 pb-20 md:px-16 md:pt-44 md:pb-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="eyebrow mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-cream/60">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-azzurro-2 animate-pulse" />
                  Progetto Pilota · Unione dei Monti Azzurri
                </span>
                <span className="hidden sm:inline h-3 w-px bg-cream/30" />
                <span>Co-promotore sviluppo · Regione Marche</span>
              </div>
            </Reveal>

            <h1 className="display display-indent text-[3.4rem] leading-[0.9] sm:text-7xl md:text-8xl xl:text-[9.5rem]">
              <Reveal as="span" delay={100}>Unire</Reveal>
              <Reveal as="span" delay={220}>parti isolate</Reveal>
            </h1>

            <Reveal delay={360}>
              <p className="mt-10 max-w-2xl text-base leading-relaxed text-cream/75 md:text-lg">
                L'ecosistema di <strong className="font-medium text-cream">Shared Value Esteso</strong> che trasforma la cultura in turismo permanente,
                digitalizzazione locale e sviluppo delle Aree Interne. Un modello multi-stakeholder a <em className="not-italic text-cream">Doppio Binario</em> in cui
                la Startup moltiplica le risorse di ogni Partner e le mette in circolo attraverso effetti spillover molti-a-molti.
              </p>
            </Reveal>

            <Reveal delay={460}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <PillButton href="#simulatore" dark>Esplora il Simulatore</PillButton>
                <PillButton href="#dossier" dark variant="outline">Richiedi il Dossier</PillButton>
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-4 hidden lg:block">
            <Reveal delay={300} className="aspect-square">
              <AmbientNetwork />
            </Reveal>
            <div className="glass-dark absolute -bottom-4 -left-6 rounded-2xl px-5 py-4">
              <div className="eyebrow text-cream/50">Leva reale estesa partner</div>
              <div className="mt-1 text-3xl font-semibold tabular tracking-tight">11× – 37×</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 pb-16 md:px-16">
        <Reveal delay={500}>
          <Marquee text="Shared Value Esteso — spillover molti-a-molti. Resa delle risorse pubbliche oltre 10×. Asset abilitanti non rivali. Cultura, turismo, digitalizzazione nelle Aree Interne." className="text-cream/80" />
          <NumberedStrip items={PARTNER_STRIP} className="text-cream/80" />
        </Reveal>

        <Reveal delay={620}>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { k: '> 10×', v: 'Resa delle risorse pubbliche (Costo per Outcome)' },
              { k: '6', v: 'Tipologie di Partner Co-Promotori connessi' },
              { k: '10 M', v: 'Impression garantite — campagne CSR Media' },
              { k: '≈ 1,16 M€', v: 'Valore Territoriale Globale / anno a regime' },
            ].map((s, i) => (
              <div key={i} className="group border-l border-cream/15 pl-5 transition-colors hover:border-azzurro-2">
                <div className="text-2xl md:text-3xl font-semibold tabular tracking-tight">{s.k}</div>
                <div className="mt-2 text-xs md:text-sm text-cream/55 leading-snug">{s.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <a href="#proof" className="absolute bottom-6 right-6 md:right-16 eyebrow hidden md:flex items-center gap-3 text-cream/50 hover:text-cream transition-colors">
        Scorri per scoprire
        <span className="relative h-10 w-px overflow-hidden bg-cream/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-cream" style={{ animation: 'scrollLine 1.8s linear infinite' }} />
        </span>
      </a>
      <style>{`@keyframes scrollLine{from{transform:translateY(-100%)}to{transform:translateY(200%)}}`}</style>
    </section>
  );
}
