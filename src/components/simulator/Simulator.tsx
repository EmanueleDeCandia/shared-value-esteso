import { useMemo, useState, type CSSProperties } from 'react';
import { DEFAULT_STATE, PARTNERS, simulate, fmt, fmtEur, fmtCompact, fmtX, fmtDec, type SimState, type PartnerId } from '../../lib/model';
import { cn } from '../../utils/cn';
import { Reveal, SectionHead } from '../ui';
import Sankey, { type Focus } from './Sankey';
import Matrix from './Matrix';

type NumKey = Exclude<keyof SimState, 'km0' | 'active' | 'networkEffect'>;

interface SliderDef { key: NumKey; label: string; min: number; max: number; step: number; unit?: string; hint?: string }

const SLIDERS: Record<PartnerId, SliderDef[]> = {
  1: [
    { key: 'nSpett1', label: 'Spettacoli (N_spett)', min: 1, max: 8, step: 1 },
    { key: 'cUnione', label: 'Contributo Unione per spettacolo (C_unione)', min: 1500, max: 5000, step: 100, unit: '€' },
    { key: 'nPmi1', label: 'Micro-imprese digitalizzate (N_pmi)', min: 2, max: 20, step: 1, hint: 'Concentrazione del pilota di lancio (Monti Azzurri)' },
  ],
  2: [
    { key: 'nUnioni', label: 'Unioni di Comuni (N_unioni)', min: 1, max: 10, step: 1 },
    { key: 'nCom', label: 'Comuni per Unione (N_com)', min: 4, max: 15, step: 1 },
    { key: 'nPmi2', label: 'PMI per Unione (N_pmi)', min: 2, max: 20, step: 1, hint: 'Media prudenziale sul perimetro regionale' },
  ],
  3: [
    { key: 'nAdd', label: 'Addetti (N_add)', min: 50, max: 5000, step: 50 },
    { key: 'vNom', label: 'Voucher nominale (V_nom)', min: 25, max: 75, step: 5, unit: '€' },
    { key: 'tRed', label: 'Tasso di redenzione (T_red)', min: 5, max: 30, step: 1, unit: '%' },
  ],
  4: [
    { key: 'nSpett4', label: 'Spettacoli finanziati (N_spett)', min: 2, max: 20, step: 1 },
    { key: 'cOut', label: 'Costo per outcome (C_out)', min: 2500, max: 10000, step: 250, unit: '€' },
  ],
  5: [
    { key: 'bMedia', label: 'Budget Media (B_media)', min: 5000, max: 50000, step: 1000, unit: '€' },
  ],
  6: [
    { key: 'nImp', label: 'Imprese aderenti (N_imp)', min: 1, max: 200, step: 1 },
    { key: 'nDip', label: 'Dipendenti per impresa (N_dip)', min: 10, max: 500, step: 5 },
  ],
};

function Slider({ def, value, onChange }: { def: SliderDef; value: number; onChange: (v: number) => void }) {
  const pct = ((value - def.min) / (def.max - def.min)) * 100;
  const id = `sl-${def.key}`;
  return (
    <div className="group">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-cream/80">{def.label}</label>
        <span className="font-mono text-sm tabular text-cream">{def.unit === '€' ? fmtEur(value) : def.unit === '%' ? `${value} %` : fmt(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={def.min}
        max={def.max}
        step={def.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider mt-3 text-cream"
        style={{ '--pct': `${pct}%`, '--thumb-ring': '#121212' } as CSSProperties}
        aria-valuetext={`${value}${def.unit ?? ''}`}
      />
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-cream/35">
        <span>{def.unit === '€' ? fmtEur(def.min) : def.min}{def.unit === '%' ? ' %' : ''}</span>
        {def.hint && <span className="text-cream/45">{def.hint}</span>}
        <span>{def.unit === '€' ? fmtEur(def.max) : def.max}{def.unit === '%' ? ' %' : ''}</span>
      </div>
    </div>
  );
}

function KPI({ label, value, sub, accent, big }: { label: string; value: string; sub?: string; accent?: boolean; big?: boolean }) {
  return (
    <div className={cn('rounded-2xl border p-5 transition-all duration-500', accent ? 'border-azzurro/50 bg-azzurro/10' : 'border-cream/10 bg-ink-2/60')}>
      <div className="eyebrow text-cream/50">{label}</div>
      <div key={value} className={cn('mt-2 font-semibold tabular tracking-tight animate-[kpi_.5s_ease]', big ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl', accent && 'text-azzurro-2')}>{value}</div>
      {sub && <div className="mt-1 text-[11px] text-cream/45 leading-snug">{sub}</div>}
      <style>{`@keyframes kpi{from{opacity:.4;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

export default function Simulator() {
  const [state, setState] = useState<SimState>(DEFAULT_STATE);
  const [profile, setProfile] = useState<PartnerId>(1);
  const [focus, setFocus] = useState<Focus>(null);
  const [selected, setSelected] = useState<{ i: number; j: number } | null>(null);

  const result = useMemo(() => simulate(state), [state]);
  const isolated = useMemo(() => simulate({ ...state, networkEffect: false }), [state]);

  const set = <K extends keyof SimState>(k: K, v: SimState[K]) => setState((s) => ({ ...s, [k]: v }));
  const toggleActive = (id: PartnerId) => setState((s) => ({ ...s, active: { ...s.active, [id]: !s.active[id] } }));

  const cur = result.partners[profile - 1];
  const meta = PARTNERS[profile - 1];
  const isDefault = JSON.stringify(state) === JSON.stringify(DEFAULT_STATE);

  return (
    <section id="simulatore" className="relative overflow-hidden bg-ink text-cream grain">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-azzurro/10 blur-[160px]" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <SectionHead
          dark
          eyebrow="Simulatore Matriciale 6×6 — Alternativa A: Sankey a 3 stadi + Matrice interattiva"
          title="Simulatore"
          titleLine2="Multi-Stakeholder"
          number="06"
          lead="Uno stato unico alimenta i 6 profili, la matrice di spillover, la Panoramica Complessiva e il Sankey. Ogni slider ricalcola l'intero ecosistema in tempo reale, con tutte le assunzioni in chiaro."
        />

        {/* ---------- Controllo scenari ---------- */}
        <Reveal className="mt-14 rounded-2xl glass-dark p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-2 text-cream/50">Partner attivi</span>
              {PARTNERS.map((p) => {
                const on = state.active[p.id];
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggleActive(p.id)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all duration-300',
                      on ? 'border-cream/60 bg-cream text-ink' : 'border-cream/20 text-cream/50 hover:border-cream/50',
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', on ? 'bg-azzurro' : 'bg-cream/30')} />
                    {p.id}. {p.short}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={state.networkEffect}
                onClick={() => set('networkEffect', !state.networkEffect)}
                className="inline-flex items-center gap-3 rounded-full border border-cream/20 px-2 py-1.5 pr-4 text-xs transition-colors hover:border-cream/50"
              >
                <span className={cn('relative h-5 w-9 rounded-full transition-colors duration-300', state.networkEffect ? 'bg-azzurro' : 'bg-cream/20')}>
                  <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-cream transition-transform duration-300', state.networkEffect ? 'translate-x-4' : 'translate-x-0.5')} />
                </span>
                {state.networkEffect ? 'Con Effetto Rete' : 'Senza Effetto Rete'}
              </button>
              <button
                type="button"
                onClick={() => { setState(DEFAULT_STATE); setSelected(null); setFocus(null); }}
                disabled={isDefault}
                className="eyebrow rounded-full border border-cream/20 px-4 py-2 transition-colors hover:border-cream/60 disabled:opacity-30"
              >
                Reset Pilota
              </button>
            </div>
          </div>
        </Reveal>

        {/* ---------- Modulo 0: Panoramica ---------- */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KPI label="Esborso complessivo Partner (C_eco)" value={fmtCompact(result.cEco)} sub="Σ Cᵢ — risorse effettivamente erogate" />
          <KPI label="Valore Economico Netto Diretto (Σ Pᵢ)" value={fmtCompact(result.pEco)} sub={`Diagonale della matrice · leva diretta ${fmtX(result.lDiretta)}`} />
          <KPI label="Totale spillover incrociati" value={fmtCompact(result.spEco)} sub="Σ In-Flow = Σ Out-Flow — valore equivalente / risparmio di duplicazione" />
          <KPI label="Valore Cumulato Fruito (Valore di Rete)" value={fmtCompact(result.vRete)} sub="Σ Pᵢ + Σ In-Flow" accent />
          <KPI label="Leva Reale Estesa media" value={fmtX(result.lEco)} sub={`Isolato ${fmtX(isolated.lEco)} → esteso ${fmtX(result.lEco)}`} accent big />
        </div>

        {/* Barra con / senza effetto rete */}
        <Reveal className="mt-4 rounded-2xl border border-cream/10 bg-ink-2/60 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="eyebrow text-cream/50">Scarto Con / Senza Effetto Rete</span>
            <span className="font-mono text-xs text-cream/70">
              Isolato {fmtEur(isolated.vRete)} → Esteso {fmtEur(result.vRete)} ({result.vRete > 0 && isolated.vRete > 0 ? `+${fmtDec(((result.vRete / isolated.vRete) - 1) * 100, 0)} %` : '—'})
            </span>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-cream/10">
            <div className="flex h-full">
              <div className="h-full bg-cream/80 transition-all duration-700" style={{ width: `${result.vRete > 0 ? (result.pEco / Math.max(result.vRete, isolated.vRete)) * 100 : 0}%` }} title="Valore diretto Σ Pᵢ" />
              <div className="h-full bg-gradient-to-r from-azzurro to-azzurro-2 transition-all duration-700" style={{ width: `${result.vRete > 0 ? (result.spEco / Math.max(result.vRete, isolated.vRete)) * 100 : 0}%` }} title="Spillover Σ In-Flow" />
            </div>
          </div>
          <div className="mt-2 flex gap-6 text-[11px] text-cream/50">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-4 rounded bg-cream/80" />Σ Pᵢ diretto</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-4 rounded bg-azzurro-2" />Σ In-Flow spillover</span>
          </div>
        </Reveal>

        {/* ---------- Profili + Formule ---------- */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="eyebrow mb-4 text-cream/50">Input modificabili — profili 1–6 (default Pilota reale)</div>
            <div role="tablist" aria-label="Profili" className="flex flex-wrap gap-1.5 border-b border-cream/15 pb-4">
              {PARTNERS.map((p) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={profile === p.id}
                  onClick={() => setProfile(p.id)}
                  className={cn(
                    'cursor-pointer rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition-all duration-300',
                    profile === p.id
                      ? 'border-cream bg-cream text-ink shadow-sm'
                      : 'border-azzurro/65 bg-azzurro/45 text-cream hover:border-azzurro hover:bg-azzurro/65',
                    !state.active[p.id] && 'opacity-40 line-through',
                  )}
                >
                  {p.id}. {p.short}
                </button>
              ))}
            </div>

            <div key={profile} className="mt-6 animate-[kpi_.4s_ease]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{meta.name}</h3>
                  <p className="mt-1 text-xs text-cream/50">{meta.sub}</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-cream/70">
                  <input type="checkbox" className="accent-[#5f86b3]" checked={state.active[profile]} onChange={() => toggleActive(profile)} />
                  Incluso nello scenario
                </label>
              </div>

              <div className="mt-7 space-y-7">
                {SLIDERS[profile].map((d) => (
                  <Slider key={d.key} def={d} value={state[d.key]} onChange={(v) => set(d.key, v)} />
                ))}
                {profile === 6 && (
                  <div className="flex items-center justify-between rounded-xl border border-cream/10 px-4 py-3">
                    <div>
                      <div className="text-sm text-cream/80">Filiera Km 0 attiva (A_km0)</div>
                      <div className="text-[11px] text-cream/45">15% addetti × 6 ordini/anno × 30 € — consegna a carico residuo</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={state.km0}
                      onClick={() => set('km0', !state.km0)}
                      className={cn('relative h-6 w-11 rounded-full transition-colors', state.km0 ? 'bg-azzurro' : 'bg-cream/20')}
                    >
                      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-cream transition-transform', state.km0 ? 'translate-x-5' : 'translate-x-0.5')} />
                    </button>
                  </div>
                )}
                {profile === 3 && (
                  <p className="rounded-xl border border-azzurro/30 bg-azzurro/10 px-4 py-3 text-[12px] text-cream/80">
                    Le Aziende Pubbliche non finanziano il progetto: C₃ rappresenta soltanto il valore dei Voucher Welfare effettivamente redenti dai propri addetti
                    (costo medio effettivo {fmtDec(cur.C / Math.max(1, state.nAdd))} €/addetto).
                  </p>
                )}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2">
                <KPI label={`Esborso C${profile}`} value={fmtCompact(cur.C)} />
                <KPI label={`Startup S${profile}`} value={fmtCompact(cur.S)} />
                <KPI label={`Pool P${profile}`} value={fmtCompact(cur.P)} accent />
              </div>
            </div>
          </div>

          {/* Formule correnti */}
          <div className="lg:col-span-7">
            <div className="eyebrow mb-4 flex items-center justify-between text-cream/50">
              <span>Formule correnti — Profilo {profile} (sempre visibili, anti-black-box)</span>
              <span className="font-mono normal-case tracking-normal">aggiornamento live</span>
            </div>
            <div className="rounded-2xl border border-cream/10 bg-ink-2/70 overflow-hidden">
              <table className="w-full text-[12.5px]">
                <thead className="text-cream/45">
                  <tr className="border-b border-cream/10">
                    <th className="px-4 py-3 text-left font-normal eyebrow">Grandezza</th>
                    <th className="px-4 py-3 text-left font-normal eyebrow hidden md:table-cell">Formula</th>
                    <th className="px-4 py-3 text-right font-normal eyebrow">Valore</th>
                  </tr>
                </thead>
                <tbody>
                  {cur.formulas.map((f, i) => (
                    <tr key={i} className={cn('border-b border-cream/[0.06] transition-colors', f.highlight ? 'bg-azzurro/10' : 'hover:bg-cream/[0.03]')}>
                      <td className="px-4 py-3 align-top">
                        <div className={cn('font-medium', f.highlight ? 'text-azzurro-2' : 'text-cream/90')}>{f.label}</div>
                        <div className="mt-1 font-mono text-[11px] text-cream/45 md:hidden">{f.formula}</div>
                      </td>
                      <td className="hidden px-4 py-3 align-top font-mono text-[11px] text-cream/55 md:table-cell">{f.formula}</td>
                      <td className={cn('px-4 py-3 text-right align-top font-mono tabular whitespace-nowrap', f.highlight ? 'text-azzurro-2 font-semibold' : 'text-cream')}>
                        {f.unit === '€' ? fmtEur(f.value) : f.unit === 'kg' ? `${fmt(f.value)} kg` : fmt(f.value)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-cream/[0.04]">
                    <td className="px-4 py-3 font-medium">Spillover ricevuto (In-Flow)</td>
                    <td className="hidden px-4 py-3 font-mono text-[11px] text-cream/55 md:table-cell">Σ<sub>i≠j</sub> α<sub>i→{profile}</sub> × Pᵢ</td>
                    <td className="px-4 py-3 text-right font-mono tabular text-azzurro-2">{fmtEur(cur.inFlow)}</td>
                  </tr>
                  <tr className="bg-cream/[0.04]">
                    <td className="px-4 py-3 font-medium">Valore Esteso Fruito (V_esteso)</td>
                    <td className="hidden px-4 py-3 font-mono text-[11px] text-cream/55 md:table-cell">P{profile} + In-Flow</td>
                    <td className="px-4 py-3 text-right font-mono tabular font-semibold">{fmtEur(cur.vEsteso)}</td>
                  </tr>
                  <tr className="bg-cream/[0.04]">
                    <td className="px-4 py-3 font-medium">Leva Diretta / Leva Reale Estesa</td>
                    <td className="hidden px-4 py-3 font-mono text-[11px] text-cream/55 md:table-cell">P{profile} / C{profile} · V_esteso / C{profile}</td>
                    <td className="px-4 py-3 text-right font-mono tabular"><span className="text-cream/60">{fmtX(cur.levaDiretta)}</span> · <span className="text-azzurro-2 font-semibold">{fmtX(cur.levaEstesa)}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            {profile === 6 && (
              <p className="mt-3 text-[11px] leading-relaxed text-cream/45">
                Guardrail: S₆ comprende solo Matching Grant 1:1 sul pernottamento e S_tech; la spesa privata dell'accompagnatore (V_priv) è tenuta separata e non è attribuita alla Startup. Nessun Matching Grant su aperitivi/cene o seconde notti.
              </p>
            )}
          </div>
        </div>

        {/* ---------- Sankey ---------- */}
        <div className="mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow text-cream/50">Vista panoramica</div>
              <h3 className="display mt-2 text-3xl md:text-5xl">Sankey a 3 stadi</h3>
            </div>
            <p className="max-w-md text-xs text-cream/55 leading-relaxed">Piccolo esborso in entrata (Cᵢ), grande valore in uscita (V_esteso). L'ampiezza dei nodi a destra include flusso diretto Pⱼ e spillover In-Flowⱼ.</p>
          </div>
          <Reveal className="rounded-2xl border border-cream/10 bg-ink-2/40 p-3 md:p-6">
            <Sankey result={result} focus={focus} setFocus={setFocus} networkEffect={state.networkEffect} />
          </Reveal>
        </div>

        {/* ---------- Matrice ---------- */}
        <div className="mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow text-cream/50">Vista analitica</div>
              <h3 className="display mt-2 text-3xl md:text-5xl">Matrice M<sub className="text-xl align-baseline">6×6</sub></h3>
            </div>
            <p className="max-w-md text-xs text-cream/55 leading-relaxed">Riga = emittente i, colonna = beneficiario j. Diagonale: Pᵢ. Fuori diagonale: α<sub>i→j</sub> × Pᵢ. Click su una cella per isolare il flusso nel Sankey.</p>
          </div>
          <Reveal>
            <Matrix result={result} focus={focus} setFocus={setFocus} selected={selected} setSelected={setSelected} />
          </Reveal>

          {/* Nota metodologica */}
          <Reveal className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Pesi α non rivali', 'I coefficienti α(i→j) non sono quote di ripartizione di cassa, ma indici di fruibilità di beni non rivali (campagne, piattaforme, infrastrutture condivise): per questo la somma per riga può superare 1, misurando il risparmio di duplicazione.'],
              ['Saldo negativo ≠ perdita', 'Un Saldo Netto In − Out negativo (es. Imprese Shared Value) non indica una perdita: segnala che quel Partner agisce da motore netto di domanda per l\'ecosistema, mantenendo una Leva Reale Estesa ampiamente positiva.'],
              ['Due contabilità affiancate', 'La Panoramica affianca sempre il Valore Economico Netto Diretto (Σ Pᵢ) e il Valore Esteso Fruito / di Rete (Σ Pᵢ + Σ In-Flow). Perimetro: Profilo 1 = concentrazione del pilota (10 PMI, Monti Azzurri); Profilo 2 = media prudenziale regionale (5 PMI/Unione × 4 Unioni = 20 PMI).'],
            ].map(([h, t], i) => (
              <div key={i} className="rounded-2xl border border-cream/10 p-5">
                <div className="eyebrow text-azzurro-2">Nota metodologica 0{i + 1}</div>
                <div className="mt-2 text-sm font-medium">{h}</div>
                <p className="mt-2 text-[12px] leading-relaxed text-cream/60">{t}</p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* ---------- Indicatori per Partner ---------- */}
        <div className="mt-20">
          <div className="eyebrow mb-4 text-cream/50">Indicatori di output per singolo Partner</div>
          <div className="overflow-x-auto thin-scroll rounded-2xl border border-cream/10">
            <table className="w-full min-w-[900px] text-[12.5px] tabular">
              <thead>
                <tr className="border-b border-cream/10 text-cream/45">
                  {['Partner', 'Esborso Cⱼ', 'Startup Sⱼ', 'Pool Pⱼ', 'In-Flow', 'Out-Flow', 'Saldo In−Out', 'V esteso', 'Leva diretta', 'Leva estesa'].map((h) => (
                    <th key={h} className={cn('px-3 py-3 font-normal eyebrow', h === 'Partner' ? 'text-left' : 'text-right')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.partners.map((p, i) => (
                  <tr
                    key={p.id}
                    className={cn('border-b border-cream/[0.06] transition-colors hover:bg-cream/[0.03]', !p.active && 'opacity-35')}
                    onMouseEnter={() => p.active && setFocus({ type: 'in', j: i })}
                    onMouseLeave={() => setFocus(null)}
                  >
                    <td className="px-3 py-3 font-medium"><span className="font-mono text-[10px] text-cream/40 mr-2">{p.id}</span>{PARTNERS[i].name}</td>
                    <td className="px-3 py-3 text-right font-mono">{fmtEur(p.C)}</td>
                    <td className="px-3 py-3 text-right font-mono text-cream/70">{fmtEur(p.S)}</td>
                    <td className="px-3 py-3 text-right font-mono">{fmtEur(p.P)}</td>
                    <td className="px-3 py-3 text-right font-mono text-azzurro-2">{fmtEur(p.inFlow)}</td>
                    <td className="px-3 py-3 text-right font-mono text-cream/70">{fmtEur(p.outFlow)}</td>
                    <td className={cn('px-3 py-3 text-right font-mono', p.saldo < 0 ? 'text-amber-200/80' : 'text-cream/80')}>{p.saldo < 0 ? '−' : '+'}{fmtEur(Math.abs(p.saldo))}</td>
                    <td className="px-3 py-3 text-right font-mono font-semibold">{fmtEur(p.vEsteso)}</td>
                    <td className="px-3 py-3 text-right font-mono text-cream/70">{fmtX(p.levaDiretta)}</td>
                    <td className="px-3 py-3 text-right font-mono font-semibold text-azzurro-2">{fmtX(p.levaEstesa)}</td>
                  </tr>
                ))}
                <tr className="bg-cream/[0.04] font-medium">
                  <td className="px-3 py-3">Ecosistema (Modulo 0)</td>
                  <td className="px-3 py-3 text-right font-mono">{fmtEur(result.cEco)}</td>
                  <td className="px-3 py-3 text-right font-mono text-cream/70">{fmtEur(result.partners.reduce((a, p) => a + p.S, 0))}</td>
                  <td className="px-3 py-3 text-right font-mono">{fmtEur(result.pEco)}</td>
                  <td className="px-3 py-3 text-right font-mono text-azzurro-2">{fmtEur(result.spEco)}</td>
                  <td className="px-3 py-3 text-right font-mono text-cream/70">{fmtEur(result.spEco)}</td>
                  <td className="px-3 py-3 text-right font-mono">0 €</td>
                  <td className="px-3 py-3 text-right font-mono font-semibold">{fmtEur(result.vRete)}</td>
                  <td className="px-3 py-3 text-right font-mono text-cream/70">{fmtX(result.lDiretta)}</td>
                  <td className="px-3 py-3 text-right font-mono font-semibold text-azzurro-2">{fmtX(result.lEco)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-cream/40">
            Assunzioni fisse: moltiplicatore Tor Vergata 2,408×; S_tech 90.000 €; 1.100 €/micro-impresa digitalizzata; MarcheStorie 10.000 €/Comune; PID 11.000 € pubblici/PMI; Voucher Pernottamento 22% × 50 €, Aperitivo/Cena 32% × 25 €; Km 0 15% × 6 ordini × 30 €; CO₂ 50 km × 0,29 kg/km per ordine.
            {state.km0 && state.active[6] && <> CO₂ evitata nello scenario corrente: <span className="text-cream/70">{fmt(result.extra.co2)} kg</span>.</>}
          </p>
        </div>
      </div>
    </section>
  );
}
