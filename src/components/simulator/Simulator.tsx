import { useMemo, useState, type CSSProperties } from 'react';
import { DEFAULT_STATE, PARTNERS, simulate, fmt, fmtEur, fmtCompact, fmtX, fmtDec, type SimState, type PartnerId } from '../../lib/model';
import { cn } from '../../utils/cn';
import { Reveal, SectionHead } from '../ui';
import Sankey, { type Focus } from './Sankey';
import Matrix from './Matrix';

type NumKey = Exclude<keyof SimState, 'km0' | 'active' | 'networkEffect'>;

interface SliderDef { key: NumKey; label: string; min: number; max: number; step: number; unit?: string; hint?: string | ((value: number) => string) }

type TabId = '1a' | '1b' | 2 | 3 | 4 | 5 | 6;

interface TabMeta {
  id: TabId;
  partnerId: PartnerId;
  chip: string;
  name: string;
  sub: string;
}

const TABS: TabMeta[] = [
  { id: '1a', partnerId: 1, chip: '1a. Monti Azzurri', name: 'Unione Monti Azzurri (Pilota)', sub: 'Pilota sperimentale — 10 PMI digitalizzate' },
  { id: '1b', partnerId: 1, chip: '1b. Altre Unioni', name: 'Altre Unioni di Comuni (4)', sub: '4 Unioni nelle altre Province — 5 PMI/Unione' },
  { id: 2, partnerId: 2, chip: '2. Regione', name: PARTNERS[1].name, sub: PARTNERS[1].sub },
  { id: 3, partnerId: 3, chip: '3. Az. Pubbliche', name: PARTNERS[2].name, sub: PARTNERS[2].sub },
  { id: 4, partnerId: 4, chip: '4. Fondazione', name: PARTNERS[3].name, sub: PARTNERS[3].sub },
  { id: 5, partnerId: 5, chip: '5. CSR Media', name: PARTNERS[4].name, sub: PARTNERS[4].sub },
  { id: 6, partnerId: 6, chip: '6. Shared Value', name: PARTNERS[5].name, sub: PARTNERS[5].sub },
];

const SLIDERS: Record<TabId, SliderDef[]> = {
  '1a': [
    { key: 'nSpett1', label: 'Spettacoli Pilota (N_spett)', min: 1, max: 8, step: 1 },
    { key: 'cUnione', label: 'Costo per Outcome / Spettacolo (C_unione)', min: 1500, max: 5000, step: 100, unit: '€', hint: 'Entrata della Startup per spettacolo' },
    { key: 'nPmi1', label: 'PMI digitalizzate Pilota (N_pmi)', min: 2, max: 20, step: 1, hint: 'Concentrazione del pilota di lancio (Monti Azzurri)' },
    { key: 'sovReg', label: 'Nuova Sovvenzione Regionale (Sov_reg)', min: 1000, max: 9000, step: 500, unit: '€', hint: (v) => `Quota dei Comuni richiesta alla Regione Marche rispetto al Benchmark di MarcheStorie: Risparmio del ${Math.round(((9000 - v) / 10000) * 100)}% su ${fmtEur(v + 1000)} totali` },
  ],
  '1b': [
    { key: 'nUnioni', label: 'Altre Unioni di Comuni (N_unioni)', min: 1, max: 10, step: 1 },
    { key: 'nSpett1', label: 'Spettacoli per Unione (N_spett)', min: 1, max: 8, step: 1 },
    { key: 'cUnione', label: 'Costo per Outcome / Spettacolo (C_unione)', min: 1500, max: 5000, step: 100, unit: '€', hint: 'Entrata della Startup per spettacolo' },
    { key: 'nPmi2', label: 'PMI digitalizzate per Unione (N_pmi)', min: 2, max: 20, step: 1, hint: 'Default 5 PMI/Unione (20 PMI su 4 Unioni)' },
    { key: 'sovReg', label: 'Nuova Sovvenzione Regionale (Sov_reg)', min: 1000, max: 9000, step: 500, unit: '€', hint: (v) => `Quota dei Comuni richiesta alla Regione Marche rispetto al Benchmark di MarcheStorie: Risparmio del ${Math.round(((9000 - v) / 10000) * 100)}% su ${fmtEur(v + 1000)} totali` },
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
    { key: 'nSpett4', label: 'Spettacoli aggiuntivi finanziati (N_spett)', min: 2, max: 50, step: 1, hint: 'Spettacoli del giorno successivo non coperti da sovvenzioni pubbliche' },
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
      <div className="mt-1.5 flex justify-between gap-2 font-mono text-[10px] text-cream/35">
        <span className="shrink-0">{def.unit === '€' ? fmtEur(def.min) : def.min}{def.unit === '%' ? ' %' : ''}</span>
        {def.hint && <span className="text-center text-cream/45">{typeof def.hint === 'function' ? def.hint(value) : def.hint}</span>}
        <span className="shrink-0">{def.unit === '€' ? fmtEur(def.max) : def.max}{def.unit === '%' ? ' %' : ''}</span>
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
  const [tab, setTab] = useState<TabId>('1a');
  const [focus, setFocus] = useState<Focus>(null);
  const [selected, setSelected] = useState<{ i: number; j: number } | null>(null);

  const result = useMemo(() => simulate(state), [state]);
  const isolated = useMemo(() => simulate({ ...state, networkEffect: false }), [state]);

  const set = <K extends keyof SimState>(k: K, v: SimState[K]) => setState((s) => ({ ...s, [k]: v }));
  const toggleActive = (id: PartnerId) => setState((s) => ({ ...s, active: { ...s.active, [id]: !s.active[id] } }));

  const tabMeta = TABS.find((t) => t.id === tab)!;
  const profile = tabMeta.partnerId;
  const cur = result.partners[profile - 1];
  const displayC = tab === '1a' ? result.unioniSplit.pilota.C : tab === '1b' ? result.unioniSplit.altre.C : cur.C;
  const displayS = tab === '1a' ? result.unioniSplit.pilota.S : tab === '1b' ? result.unioniSplit.altre.S : cur.S;
  const displayP = tab === '1a' ? result.unioniSplit.pilota.P : tab === '1b' ? result.unioniSplit.altre.P : cur.P;
  const displayInFlow = tab === '1a' || tab === '1b' ? (cur.P > 0 ? cur.inFlow * (displayP / cur.P) : 0) : cur.inFlow;
  const displayVEsteso = displayP + displayInFlow;
  const displayLevaDiretta = displayC > 0 ? displayP / displayC : 0;
  const displayLevaEstesa = displayC > 0 ? displayVEsteso / displayC : 0;
  const displayFormulas = tab === '1a' ? result.unioniSplit.pilota.formulas : tab === '1b' ? result.unioniSplit.altre.formulas : cur.formulas;
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
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'cursor-pointer rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition-all duration-300',
                    tab === t.id
                      ? 'border-cream bg-cream text-ink shadow-sm'
                      : 'border-azzurro/65 bg-azzurro/45 text-cream hover:border-azzurro hover:bg-azzurro/65',
                    !state.active[t.partnerId] && 'opacity-40 line-through',
                  )}
                >
                  {t.chip}
                </button>
              ))}
            </div>

            <div key={tab} className="mt-6 animate-[kpi_.4s_ease]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{tabMeta.name}</h3>
                  <p className="mt-1 text-xs text-cream/50">{tabMeta.sub}</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-cream/70">
                  <input type="checkbox" className="accent-[#5f86b3]" checked={state.active[profile]} onChange={() => toggleActive(profile)} />
                  Incluso nello scenario
                </label>
              </div>

              <div className="mt-7 space-y-7">
                {SLIDERS[tab].map((d) => (
                  <Slider key={`${tab}-${d.key}`} def={d} value={state[d.key]} onChange={(v) => set(d.key, v)} />
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
                <KPI label={`Esborso C${tab}`} value={fmtCompact(displayC)} />
                <KPI label={`Startup S${tab}`} value={fmtCompact(displayS)} />
                <KPI label={`Pool P${tab}`} value={fmtCompact(displayP)} accent />
              </div>
            </div>
          </div>

          {/* Formule correnti */}
          <div className="lg:col-span-7">
            <div className="eyebrow mb-4 flex items-center justify-between text-cream/50">
              <span>Formule correnti — Profilo {tab} (sempre visibili, anti-black-box)</span>
              <span className="font-mono normal-case tracking-normal">aggiornamento live</span>
            </div>
            <div className="rounded-2xl border border-cream/10 bg-ink-2/70 overflow-hidden">
              <table className="w-full text-[12.5px]">
                <thead className="text-cream/45">
                  <tr className="border-b border-cream/10">
                    <th className="px-4 py-3 text-left font-normal eyebrow">Grandezza</th>
                    <th className="px-3 py-3 text-left font-normal eyebrow">Sigla</th>
                    <th className="px-4 py-3 text-left font-normal eyebrow hidden md:table-cell">Formula</th>
                    <th className="px-4 py-3 text-right font-normal eyebrow">Valore</th>
                  </tr>
                </thead>
                <tbody>
                  {displayFormulas.map((f, i) => (
                    <tr key={i} className={cn('border-b border-cream/[0.06] transition-colors', f.highlight ? 'bg-azzurro/10' : 'hover:bg-cream/[0.03]')}>
                      <td className="px-4 py-3 align-top">
                        <div className={cn('font-medium', f.highlight ? 'text-azzurro-2' : 'text-cream/90')}>{f.label}</div>
                        <div className="mt-1 font-mono text-[11px] text-cream/45 md:hidden">{f.formula}</div>
                      </td>
                      <td className="px-3 py-3 align-top font-mono text-[10px] tracking-tight text-azzurro-2/85 whitespace-nowrap">
                        {f.code ?? ''}
                      </td>
                      <td className="hidden px-4 py-3 align-top font-mono text-[11px] text-cream/55 md:table-cell">{f.formula}</td>
                      <td className={cn('px-4 py-3 text-right align-top font-mono tabular whitespace-nowrap', f.highlight ? 'text-azzurro-2 font-semibold' : 'text-cream')}>
                        {f.unit === '€' ? fmtEur(f.value) : f.unit === 'kg' ? `${fmt(f.value)} kg` : fmt(f.value)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-cream/[0.04]">
                    <td className="px-4 py-3 font-medium">Spillover ricevuto</td>
                    <td className="px-3 py-3 font-mono text-[10px] tracking-tight text-azzurro-2/85 whitespace-nowrap">In-Flow</td>
                    <td className="hidden px-4 py-3 font-mono text-[11px] text-cream/55 md:table-cell">Σ<sub>i≠j</sub> α<sub>i→{profile}</sub> × Pᵢ{tab === '1a' || tab === '1b' ? ` (quota ${tab})` : ''}</td>
                    <td className="px-4 py-3 text-right font-mono tabular text-azzurro-2">{fmtEur(displayInFlow)}</td>
                  </tr>
                  <tr className="bg-cream/[0.04]">
                    <td className="px-4 py-3 font-medium">Valore Esteso Fruito</td>
                    <td className="px-3 py-3 font-mono text-[10px] tracking-tight text-azzurro-2/85 whitespace-nowrap">V_esteso</td>
                    <td className="hidden px-4 py-3 font-mono text-[11px] text-cream/55 md:table-cell">P{tab} + In-Flow</td>
                    <td className="px-4 py-3 text-right font-mono tabular font-semibold">{fmtEur(displayVEsteso)}</td>
                  </tr>
                  <tr className="bg-cream/[0.04]">
                    <td className="px-4 py-3 font-medium">Leva Diretta / Leva Reale Estesa</td>
                    <td className="px-3 py-3 font-mono text-[10px] tracking-tight text-azzurro-2/85 whitespace-nowrap">Leva</td>
                    <td className="hidden px-4 py-3 font-mono text-[11px] text-cream/55 md:table-cell">P{tab} / C{tab} · V_esteso / C{tab}</td>
                    <td className="px-4 py-3 text-right font-mono tabular"><span className="text-cream/60">{fmtX(displayLevaDiretta)}</span> · <span className="text-azzurro-2 font-semibold">{fmtX(displayLevaEstesa)}</span></td>
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
              ['Pesi α non rivali', 'I coefficienti α(i→j) non sono quote di ripartizione di cassa, ma indici di fruibilità di beni non rivali (campagne, piattaforme, infrastrutture condivise): per questo la somma per riga può superare 1, misurando sia il risparmio di duplicazione dei costi che il valore creato dalle esternalità positive da coordinamento.'],
              ['Saldo negativo ≠ perdita', 'Un Saldo Netto In − Out negativo (es. Unioni o Imprese Shared Value) non indica una perdita: segnala che quel Partner agisce da motore netto di esternalità positive per l\'ecosistema, mantenendo un V_esteso e una Leva Reale Estesa ampiamente positivi.'],
              ['Due contabilità affiancate', 'La Panoramica affianca sempre il Valore Economico Netto Diretto (Σ Pᵢ) e il Valore Esteso Fruito / di Rete (Σ Pᵢ + Σ In-Flow). Perimetro Unioni: 1a = Pilota Monti Azzurri (10 PMI); 1b = altre 4 Unioni (5 PMI/Unione = 20 PMI).'],
              ['Ripartizione 50/50 del Risparmio', 'Per azzerare ogni doppio conteggio tra P₁ e P₂, il Risparmio Pubblico sulle 4 Unioni (MarcheStorie + PID) è ripartito in somme equivalenti: 50% alle Unioni (P₁b) e 50% alla Regione Marche (P₂). Il Pilota Monti Azzurri (P₁a) resta al 100% su P₁.'],
              ['Clausola di reinvestimento', 'Il Risparmio Pubblico è un bene pubblico che libera capacità fiscale. Sotto clausola di reinvestimento coordinato verso Partner esistenti o nuovi entranti, esso remunera le esternalità negative da mancato coordinamento risolte dalla Startup.'],
              ['Esborso Unioni vs Startup', 'L\'unico esborso effettivo delle Unioni è il Costo per Outcome (C₁ = 3.000 €/spettacolo) verso la Startup. La digitalizzazione PMI (1.100 €/PMI = 1/10 PID) e il Coordinamento/Gestione Eventi (3.000 €/spettacolo) sono co-investimenti della Startup (S₁).'],
              ['Sovvenzione Regionale (Sov_reg)', 'Dei 10.000 € del benchmark MarcheStorie, 1.000 € vanno alla Startup e fino a 9.000 € possono essere richiesti dai Comuni alla Regione. Sov_reg è un\'entrata dei Comuni (non un loro esborso) ed è un esborso della Regione (C₂) che riduce R_MS.'],
              ['Pesi Regione Marche (Σ = 1,00)', 'La riga Regione Marche somma esattamente a 1,00 (0,50 verso Unioni, 0,10 Az. Pubbliche, 0,10 Fondazione, 0,15 CSR, 0,15 Shared Value), riflettendo legittimazione istituzionale e riallocazione della capacità fiscale senza moltiplicazioni artificiali.'],
              ['Lettura di V_esteso e Saldo', 'V_esteso = Pⱼ + In-Flow non sottrae l\'Out-Flow perché i beni non rivali ceduti restano fruibili dall\'emittente. Il Saldo In−Out confronta solo esternalità ricevute e cedute: un saldo negativo identifica i principali generatori netti di valore dell\'ecosistema.'],
            ].map(([h, t], i) => (
              <div key={i} className="rounded-2xl border border-cream/10 p-5">
                <div className="eyebrow text-azzurro-2">Nota metodologica {String(i + 1).padStart(2, '0')}</div>
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
            Assunzioni fisse: moltiplicatore Tor Vergata 2,408×; S_tech 90.000 €; Piattaforma Fondazione Pay per Outcome 137.000 €; 1.100 €/micro-impresa digitalizzata (1/10 PID); Coordinamento & Gestione Eventi Startup 3.000 €/spettacolo; MarcheStorie 10.000 €/Comune (1.000 € Startup + fino a 9.000 € Sov_reg); PID 11.000 € pubblici/PMI; Voucher Pernottamento 22% × 50 €, Aperitivo/Cena 32% × 25 €; Km 0 15% × 6 ordini × 30 €; CO₂ 50 km × 0,29 kg/km per ordine.
            {state.km0 && state.active[6] && <> CO₂ evitata nello scenario corrente: <span className="text-cream/70">{fmt(result.extra.co2)} kg</span>.</>}
          </p>
        </div>
      </div>
    </section>
  );
}
