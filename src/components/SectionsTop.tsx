import { useEffect, useState } from 'react';
import { CountUp, Reveal, SectionHead } from './ui';
import { cn } from '../utils/cn';

/* ------------------------------------------------------------------ */
/* Social proof — perimetro istituzionale                               */
/* ------------------------------------------------------------------ */
export function Proof() {
  const entities = [
    'Regione Marche',
    'Unione dei Monti Azzurri',
    'Fondazione Bancaria',
    'Università & Aziende Sanitarie',
    'Co-promotori (Gruppo ILL)',
    'Co-promotori (Gruppo EXE)',
    'Rete PMI CSR',
    'Camere di Commercio · PID',
  ];
  return (
    <section id="proof" className="bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-16 md:py-20">
        <Reveal>
          <div className="eyebrow flex items-center justify-between text-ink/50">
            <span>Perimetro dei Co-Promotori</span>
            <span className="hidden sm:inline">Pilota 2025/26 → Sviluppo regionale in 4 Province</span>
          </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 border-t border-ink/15 md:grid-cols-4">
          {entities.map((e, i) => (
            <Reveal key={e} delay={i * 60} className={cn('border-b border-ink/15 py-6 md:py-8 pr-4', i % 2 === 0 ? 'border-r md:border-r' : 'md:border-r', (i + 1) % 4 === 0 && 'md:border-r-0')}>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-ink/40" />
                <span className="text-sm md:text-base font-medium tracking-tight">{e}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-4">
          {[
            { to: 10, suffix: '×', label: 'Costo per Outcome Regione = (MarcheStorie + PID) / 10', dec: 0 },
            { to: 36, prefix: '> ', suffix: '×', label: 'Leva reale estesa massima dei singoli Partner', dec: 0 },
            { to: 2.408, suffix: '×', label: 'Moltiplicatore Università Tor Vergata (Min. Turismo)', dec: 3 },
            { to: 1.16, prefix: '≈ ', suffix: ' M€', label: 'Valore Territoriale Globale diretto / anno a regime', dec: 2 },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="text-5xl md:text-6xl font-semibold tracking-tighter tabular">
                <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} decimals={s.dec} />
              </div>
              <div className="mt-3 max-w-[16rem] text-sm text-ink/60 leading-snug">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Confronto 3 modelli — tre pannelli editoriali                        */
/* ------------------------------------------------------------------ */
const MODELS = [
  {
    title: 'Frammentato',
    title2: 'Pubblico',
    tag: '1 bando = 1 evento',
    desc: 'L\'impatto termina alla chiusura del sipario. Costi di gestione elevati, nessuna canalizzazione di risorse private, zero asset residui sul territorio.',
    rows: ['Impatto limitato alla durata dell\'evento', 'Costi di gestione pubblici elevati', 'Nessuna risorsa privata attivata', 'Zero asset residui'],
    bad: true,
  },
  {
    title: 'Frammentato',
    title2: 'Privato',
    tag: '1 sponsorizzazione = 1 progetto',
    desc: 'Fondi CSR dedicati a un solo progetto: terminata l\'iniziativa va rifinanziata perché non genera valore duraturo né asset condivisi con altri attori.',
    rows: ['Fondi vincolati a un solo progetto', 'Da rifinanziare a ogni ciclo', 'Nessun asset condiviso', 'Impatto ESG difficilmente misurabile'],
    bad: true,
  },
  {
    title: 'Startup',
    title2: 'Shared Value Esteso',
    tag: '1 ecosistema a Doppio Binario',
    desc: 'Connette 6 tipologie di Partner Co-Promotori e trasforma risorse separate in asset abilitanti non rivali, generando effetti spillover molti-a-molti a beneficio di tutti.',
    rows: ['Asset abilitanti non rivali e permanenti', 'Spillover molti-a-molti (In-Flow / Out-Flow)', 'Leva estesa 11× – 37× per Partner', 'Misurazione certificata, Evidence-Based Policy'],
    bad: false,
  },
];

export function Comparison() {
  return (
    <section id="modello" className="bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <SectionHead
          eyebrow="Blocco 1 — Proposta di valore"
          title="Tre modelli,"
          titleLine2="un solo esito duraturo"
          number="01"
          lead="Contrapporre gli interventi isolati all'ecosistema orchestrato dalla Startup rende evidente dove nasce il valore: nella connessione tra attori, non nella somma dei singoli budget."
        />

        <div className="mt-16 grid gap-px bg-ink/15 md:grid-cols-3 border border-ink/15">
          {MODELS.map((m, i) => (
            <Reveal key={i} delay={i * 120} className={cn('group relative flex flex-col p-8 md:p-10 transition-colors duration-500', m.bad ? 'bg-paper hover:bg-paper-2' : 'bg-ink text-cream')}>
              <div className="eyebrow flex items-center justify-between opacity-60">
                <span>{m.tag}</span>
                <span className="tabular">0{i + 1}</span>
              </div>
              <h3 className="display display-indent mt-10 text-4xl md:text-[2.6rem] leading-[0.95]">
                <span>{m.title}</span>
                <span className="!pl-8">{m.title2}</span>
              </h3>
              <div className={cn('my-8 h-px', m.bad ? 'bg-ink/15' : 'bg-cream/20')} />
              <p className={cn('text-sm leading-relaxed', m.bad ? 'text-ink/65' : 'text-cream/70')}>{m.desc}</p>
              <ul className="mt-8 space-y-0">
                {m.rows.map((r, k) => (
                  <li key={k} className={cn('flex items-start gap-3 border-t py-3 text-sm', m.bad ? 'border-ink/10' : 'border-cream/15')}>
                    <sup className="mt-1 text-[9px] opacity-50">{k + 1}</sup>
                    <span className="flex-1">{r}</span>
                    {m.bad ? (
                      <svg className="mt-1 h-3.5 w-3.5 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    ) : (
                      <svg className="mt-1 h-3.5 w-3.5 text-azzurro-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                    )}
                  </li>
                ))}
              </ul>
              {!m.bad && (
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-azzurro/25 blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-60" aria-hidden />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Core Logic — due stadi (Amplificazione verticale + Irradiazione)     */
/* ------------------------------------------------------------------ */
function AmplificationDiagram() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 3), 2600);
    return () => clearInterval(id);
  }, []);
  const partners = ['1', '2', '3', '4', '5', '6'];
  return (
    <svg viewBox="0 0 640 420" className="w-full" role="img" aria-label="Diagramma: dal contributo del Partner al Pool Abilitato e all'irradiazione verso gli altri Partner">
      <defs>
        <linearGradient id="flowGrad" x1="0" x2="1">
          <stop offset="0" stopColor="#e9e6df" stopOpacity="0.4" />
          <stop offset="1" stopColor="#8fb0d6" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* Stadio 1 */}
      <g>
        <rect x="24" y="150" width="130" height="120" rx="6" fill="none" stroke="#e9e6df" strokeOpacity="0.35" />
        <text x="89" y="178" textAnchor="middle" fontSize="10" fill="#e9e6df" fillOpacity="0.55" letterSpacing="2">IMPRESA CSR</text>
        <text x="89" y="214" textAnchor="middle" fontSize="26" fontWeight="600" fill="#e9e6df">C₅</text>
        <text x="89" y="246" textAnchor="middle" fontSize="13" fill="#e9e6df" fillOpacity="0.8" fontFamily="JetBrains Mono">25.000 €</text>
      </g>
      <path d="M154 210 H250" stroke="url(#flowGrad)" strokeWidth={phase >= 0 ? 10 : 2} strokeLinecap="round" className="transition-all duration-700" />
      {/* Hub */}
      <g className="transition-all duration-700">
        <rect x="250" y="110" width="150" height="200" rx="8" fill="#e9e6df" />
        <text x="325" y="140" textAnchor="middle" fontSize="10" fill="#121212" fillOpacity="0.6" letterSpacing="2">HUB STARTUP</text>
        <text x="325" y="172" textAnchor="middle" fontSize="12" fill="#121212" fillOpacity="0.7">+ S₅ = 50.000 €</text>
        <text x="325" y="190" textAnchor="middle" fontSize="9" fill="#121212" fillOpacity="0.55">creatività · piattaforma · editoria</text>
        <text x="325" y="203" textAnchor="middle" fontSize="9" fill="#121212" fillOpacity="0.55">conversioni · misurazione</text>
        <line x1="270" y1="222" x2="380" y2="222" stroke="#121212" strokeOpacity="0.2" />
        <text x="325" y="250" textAnchor="middle" fontSize="11" fill="#121212" fillOpacity="0.6" letterSpacing="1">POOL ABILITATO P₅</text>
        <text x="325" y="282" textAnchor="middle" fontSize="26" fontWeight="600" fill="#121212" style={{ opacity: phase >= 1 ? 1 : 0.25, transition: 'opacity .6s' }}>75.000 €</text>
        <text x="325" y="300" textAnchor="middle" fontSize="10" fill="#5f86b3" fontWeight="600">rapporto 2 : 1</text>
      </g>
      {/* Stadio 2 — irradiazione */}
      {partners.map((p, i) => {
        const y = 60 + i * 60;
        const on = phase === 2;
        return (
          <g key={p}>
            <path d={`M400 ${210} C 470 ${210}, 480 ${y}, 560 ${y}`} fill="none" stroke="#8fb0d6" strokeOpacity={on ? 0.9 : 0.2} strokeWidth={on ? (i === 4 ? 9 : 3 + (i % 3)) : 1.5} strokeDasharray={on ? '0' : '3 6'} className="transition-all duration-700" style={{ transitionDelay: `${i * 80}ms` }} />
            <circle cx="580" cy={y} r="18" fill="#121212" stroke={on ? '#8fb0d6' : '#e9e6df'} strokeOpacity={on ? 1 : 0.35} className="transition-all duration-700" />
            <text x="580" y={y + 4} textAnchor="middle" fontSize="11" fill="#e9e6df" fontFamily="JetBrains Mono">{p}</text>
            <text x="608" y={y + 4} fontSize="9" fill="#e9e6df" fillOpacity="0.5">{i === 4 ? 'diretto' : `α${i + 1}`}</text>
          </g>
        );
      })}
      {/* labels */}
      <text x="24" y="330" fontSize="10" fill="#e9e6df" fillOpacity="0.55" letterSpacing="2">STADIO 1 — AMPLIFICAZIONE VERTICALE</text>
      <text x="400" y="400" fontSize="10" fill="#e9e6df" fillOpacity="0.55" letterSpacing="2">STADIO 2 — IRRADIAZIONE ORIZZONTALE</text>
      <text x="24" y="348" fontSize="10" fill="#e9e6df" fillOpacity="0.4">Partner → Hub Startup</text>
      <text x="400" y="416" fontSize="10" fill="#e9e6df" fillOpacity="0.4">Hub → tutti gli altri Partner (In-Flow a costo marginale nullo)</text>
    </svg>
  );
}

export function CoreLogic() {
  return (
    <section className="bg-ink text-cream grain relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-1/3 h-[28rem] w-[28rem] rounded-full bg-azzurro/10 blur-[130px]" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <SectionHead
          dark
          eyebrow="Core Logic — generazione del valore in due stadi"
          title="Da un apporto"
          titleLine2="a un ecosistema"
          number="02"
          lead="Tutta la struttura testuale e di calcolo si basa su una dinamica non lineare: prima l'Hub amplifica, poi irradia. Ogni Partner è insieme generatore (Out-Flow) e beneficiario (In-Flow) di spillover."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Reveal className="rounded-2xl border border-cream/10 bg-ink-2/60 p-4 md:p-8">
              <AmplificationDiagram />
            </Reveal>
          </div>
          <div className="lg:col-span-5 space-y-10">
            <Reveal delay={100}>
              <div className="eyebrow text-azzurro-2">Stadio 1</div>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">Amplificazione verticale <span className="text-cream/40">Partner → Hub</span></h3>
              <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-cream/70">
                Ogni Partner <i>i</i> conferisce il proprio apporto specifico <b className="font-medium text-cream">C<sub>i</sub></b> (budget media, asset logistici, voucher welfare, teatri, pay-per-outcome).
                La Startup abbina un proprio co-investimento <b className="font-medium text-cream">S<sub>i</sub></b> in tecnologia, creatività, matching grant, piattaforme e gestione, generando il
                <b className="font-medium text-cream"> Pool Abilitato P<sub>i</sub></b> (che nei profili turistici integra l'indotto macroeconomico 2,408×).
              </p>
              <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-cream/15 px-4 py-2 font-mono text-xs text-cream/80">
                <span>25.000 €</span><span className="opacity-40">+</span><span>50.000 €</span><span className="opacity-40">=</span><span className="text-azzurro-2">75.000 €</span>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="eyebrow text-azzurro-2">Stadio 2</div>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">Irradiazione orizzontale <span className="text-cream/40">Hub → tutti</span></h3>
              <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-cream/70">
                Il Pool <b className="font-medium text-cream">P<sub>i</sub></b> non produce valore soltanto per il Partner emittente: si irradia verso gli altri Partner Co-Promotori
                (<i>j ≠ i</i>) a <b className="font-medium text-cream">costo marginale nullo</b> per chi lo riceve, secondo coefficienti di assorbimento α<sub>i→j</sub> di beni non rivali.
                È la differenza tra <em className="not-italic text-cream">Valore Economico Netto</em> (Σ P<sub>i</sub>) e <em className="not-italic text-cream">Valore di Rete</em> (Σ P<sub>i</sub> + Σ In-Flow).
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
