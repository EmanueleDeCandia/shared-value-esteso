import { useState } from 'react';
import { cn } from '../utils/cn';
import { Reveal, SectionHead, NumberedStrip } from './ui';
import { PARTNERS } from '../lib/model';

/* ------------------------------------------------------------------ */
/* Doppio Binario                                                      */
/* ------------------------------------------------------------------ */
const TRACKS = [
  {
    n: '01',
    title: 'Binario 1',
    sub: 'Fisico & Eventi Congiunti',
    gen: 'Generatore di spillover turistico-ricettivi',
    img: '/images/performing-art.jpg',
    overlay: 'Lo spettatore diventa turista culturale: spettacolo, pernottamento, cena con gli artisti.',
    unit: 'Unione di Comuni nelle Aree Interne',
    points: [
      ['Ancora esperienziale', 'Spettacoli di Performing Art (Giorno 1) abbinati a Voucher di Welfare Aziendale: pernottamento + cena con artisti.'],
      ['Matching Grant 1:1', 'Sul solo pernottamento la Startup eroga 50 € (25 € dipendente + 25 € accompagnatore) per biglietto spettacolo e servizi locali. Zero seconde notti, esclusi aperitivi/cene.'],
      ['Effetto abilitante', 'Rende attrattivi e spendibili i voucher di tutti i Partner (Imprese e Aziende Pubbliche) e genera domanda reale per le micro-imprese digitalizzate.'],
    ],
    strip: ['Spettacoli', 'Voucher Welfare', 'Matching Grant', 'Ospitalità', 'Filiera Km 0'],
  },
  {
    n: '02',
    title: 'Binario 2',
    sub: 'Digitale & Continuità Spazio-Temporale',
    gen: 'Generatore di spillover mediatici e tecnologici',
    img: '/images/digitale.jpg',
    overlay: 'Prima e dopo lo spettacolo: la destinazione vive tutto l\'anno su piattaforme fornite senza costi.',
    unit: 'Infrastruttura digitale permanente',
    points: [
      ['Problema risolto', 'Supera la finitudine fisica dello spettacolo: posti teatro, posti letto, finestra temporale del weekend.'],
      ['Attività prima e dopo', 'Concorsi, tornei Hub & Spoke, premiazioni, reward etici, editoria multimediale interattiva, Web Hub destinazione e strumenti MarTech per le PMI.'],
      ['Effetto abilitante', 'Piattaforme, tool editoriali, creatività e applicazioni verticali fornite senza costi dalla Startup amplificano simultaneamente visibilità e conversioni di tutti i 6 Partner.'],
    ],
    strip: ['Contest', 'Tornei Hub & Spoke', 'Editoria multimediale', 'Web Hub', 'MarTech PMI'],
  },
];

export function DualTrack() {
  return (
    <section id="binari" className="bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-6 pt-20 md:px-16 md:pt-32">
        <SectionHead
          eyebrow="Blocco 2 — Sistema di prodotto"
          title="Il Doppio"
          titleLine2="Binario"
          number="03"
          lead="Il motore degli spillover: un binario fisico che trasforma spettatori in turisti e un binario digitale che dà continuità spazio-temporale alla destinazione."
        />
      </div>

      <div className="mt-16 space-y-0">
        {TRACKS.map((t, i) => (
          <article key={t.n} className="border-t border-ink/15">
            <div className="mx-auto max-w-[1440px] px-6 md:px-16">
              <div className="grid gap-10 py-14 md:grid-cols-12 md:py-20">
                <div className="md:col-span-5">
                  <Reveal>
                    <div className="eyebrow flex items-center gap-3 text-ink/50">
                      <span className="tabular">{t.n}</span>
                      <span className="h-px w-8 bg-ink/40" />
                      {t.gen}
                    </div>
                    <h3 className="display mt-6 text-4xl md:text-6xl">{t.title}</h3>
                    <p className="mt-3 text-xl md:text-2xl font-light tracking-tight text-ink/70">{t.sub}</p>
                    <p className="eyebrow mt-6 text-ink/40">Unità minima · {t.unit}</p>
                  </Reveal>
                </div>
                <div className="md:col-span-7">
                  <ul className="divide-y divide-ink/10 border-t border-ink/10">
                    {t.points.map(([h, d], k) => (
                      <Reveal as="li" key={k} delay={k * 90} className="grid gap-2 py-5 sm:grid-cols-12">
                        <div className="sm:col-span-4 flex items-start gap-2 text-sm font-medium">
                          <sup className="text-[9px] opacity-50">{k + 1}</sup>{h}
                        </div>
                        <p className="sm:col-span-8 text-sm leading-relaxed text-ink/65">{d}</p>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <Reveal className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
              <img
                src={t.img}
                alt={t.sub}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-6 pb-8 md:px-16 md:pb-12 text-cream">
                <p className="eyebrow max-w-xs opacity-80 hidden sm:block">{i === 0 ? 'Il nostro impegno: trasformare lo spettatore in turista culturale' : 'Visibilità e conversioni per tutti i 6 Partner, tutto l\'anno'}</p>
                <p className="max-w-md text-base md:text-xl font-light leading-snug uppercase tracking-tight">{t.overlay}</p>
              </div>
            </Reveal>

            <div className="mx-auto max-w-[1440px] px-6 md:px-16">
              <NumberedStrip items={t.strip} className="text-ink/80 border-b-0" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6 Partner — architettura a 6 dimensioni                              */
/* ------------------------------------------------------------------ */
interface PartnerDetail {
  ruolo: string;
  contributo: string;
  coinv: string;
  out: string;
  inflow: string;
  netto: string;
}

const DETAILS: Record<number, PartnerDetail> = {
  1: {
    ruolo: 'Unità minima territoriale del Binario 1: luoghi, palcoscenici e ospitalità delle Aree Interne. Pilota: Unione dei Monti Azzurri.',
    contributo: 'Condivisione Teatro + contributo Costo per Outcome analogo a MarcheStorie. Contratto a Performance Garantita.',
    coinv: 'Piattaforma Binario 2, Web Hub destinazione, digitalizzazione MarTech delle micro-imprese locali.',
    out: 'Luoghi, palcoscenici e ospitalità che rendono fruibili i Voucher Welfare e autentico lo storytelling CSR.',
    inflow: 'Campagne Paid Media (10 M impression) dalle Imprese CSR; flussi turistici e prenotazioni da Imprese Shared Value e Aziende Pubbliche; risorse culturali dalla Fondazione.',
    netto: 'Con 18.000 € di esborso, un Valore Esteso Fruito superiore a 660.000 €: la leva reale estesa più alta dell\'ecosistema (≈ 37×).',
  },
  2: {
    ruolo: 'Co-promotore dello sviluppo nelle 4 Province di Ancona, Pesaro-Urbino, Fermo e Ascoli Piceno. Massimo beneficiario istituzionale di spillover.',
    contributo: 'Contributo residuale al Costo per Outcome pari a (MarcheStorie + PID) / 10.',
    coinv: 'Orchestrazione integrata, infrastruttura tecnologica, misurazione d\'impatto e Evidence-Based Policy.',
    out: 'Legittimazione istituzionale e cornice territoriale che abilita l\'ingaggio di Fondazioni e Grandi Imprese.',
    inflow: 'Assorbe l\'impatto mediatico delle Imprese CSR, la digitalizzazione delle PMI, il turismo destagionalizzato e la filiera Km 0 dei Partner privati e pubblici.',
    netto: 'Efficienza diretta 10× sui benchmark regionali, a cui si somma gratuitamente l\'effetto spillover dell\'intero ecosistema.',
  },
  3: {
    ruolo: 'Università e Aziende Sanitarie. Nessun finanziamento al progetto: erogano esclusivamente Voucher Welfare ai propri addetti.',
    contributo: 'Solo Voucher Welfare (max 75 €; con redenzione del 20% il costo medio effettivo è 15 €/addetto).',
    coinv: 'Matching Grant 100%, piattaforma di erogazione, comunicazione istituzionale e tool di valorizzazione.',
    out: 'Domanda turistica qualificata e destagionalizzata per teatri, borghi e micro-imprese delle Unioni di Comuni.',
    inflow: 'Accesso gratuito all\'intera infrastruttura Welfare e booking già abilitata dai Partner Shared Value, oltre agli spettacoli finanziati da Unioni e Fondazione.',
    netto: 'Welfare ad alto valore percepito per gli addetti a costo effettivo minimo, con leva reale estesa oltre 11×.',
  },
  4: {
    ruolo: 'Finanziatore Pay per Outcome legato a esiti certificati, garante della qualità culturale della programmazione.',
    contributo: 'Pay per Outcome su spettacoli/artisti, quota Matching Grant, licenze editoria digitale.',
    coinv: 'Gestione operativa, piattaforma MarTech, monitoraggio certificato degli outcome.',
    out: 'Produzione culturale, co-copertura Matching Grant e contenuti editoriali che alimentano l\'attrattività dell\'intero ecosistema.',
    inflow: 'Amplificazione mediatica (10 M impression) dalle Imprese CSR e moltiplicazione del pubblico tramite i canali Welfare dei Partner industriali e pubblici.',
    netto: 'Ogni euro erogato a risultato certificato viene amplificato da media, welfare e infrastruttura digitale altrui.',
  },
  5: {
    ruolo: 'Imprese che investono in branding istituzionale legato alle destinazioni degli spettacoli.',
    contributo: 'Finanziano solo il Budget Media (es. 25.000 €) per campagne digitali sulle località.',
    coinv: 'Circa 50.000 € ogni 25.000 € di budget Partner: creatività, piattaforma di promozione, editoria multimediale, conversioni e misurazione.',
    out: 'Traffico qualificato (10 M impression), posizionamento delle destinazioni e conversioni dirette verso strutture locali a beneficio di Regione, Unioni, Fondazione e Partner Welfare.',
    inflow: 'Contenuti culturali autentici (Unioni/Fondazione) e infrastruttura ricettiva digitalizzata che trasformano la pubblicità in impatto misurabile ESG/CSR.',
    netto: 'Un budget media triplicato (3 × B_media) e convertito in impatto territoriale rendicontabile.',
  },
  6: {
    ruolo: 'Co-promotori (Gruppo EXE), (Gruppo ILL) e Rete PMI CSR: motore netto di domanda e infrastruttura dell\'ecosistema.',
    contributo: 'Rete PMI CSR: soli Voucher Welfare effettivamente redenti (19 € medi/lavoratore). Gruppo ILL: 0 € monetari (flotta a carico residuo + base clienti). Gruppo EXE: 0 € fissi (Cause Related Marketing via E-commerce as a Service).',
    coinv: 'Matching Grant 1:1 sul solo pernottamento (50 € = 25 + 25 € sul 22% degli addetti) + infrastruttura digitale, strumenti MarTech e Web Space CSRD/WICI (S_tech = 90.000 €).',
    out: 'Spillover infrastrutturale e di domanda: strumenti di prenotazione delle PMI digitalizzate e piattaforma Welfare fruibili da tutti i Partner; la filiera Km 0 abbatte CO₂ e genera reddito locale.',
    inflow: 'Spettacoli e teatri (Unioni/Fondazione) come leva esperienziale per i dipendenti; copertura mediatica (Imprese CSR) che rafforza la visibilità della propria Best Practice.',
    netto: 'Saldo In–Out negativo per scelta: agisce da motore netto di domanda, mantenendo una leva reale estesa ampiamente positiva.',
  },
};

const DIMS: { key: keyof PartnerDetail; label: string; sym?: string }[] = [
  { key: 'ruolo', label: 'Ruolo' },
  { key: 'contributo', label: 'Contributo Diretto', sym: 'Cᵢ' },
  { key: 'coinv', label: 'Co-Investimento Startup', sym: 'Sᵢ' },
  { key: 'out', label: 'Spillover Generato', sym: 'Out-Flow' },
  { key: 'inflow', label: 'Spillover Ricevuto', sym: 'In-Flow' },
  { key: 'netto', label: 'Beneficio Netto' },
];

export function Partners() {
  const [sel, setSel] = useState(1);
  const p = PARTNERS[sel - 1];
  const d = DETAILS[sel];
  return (
    <section id="partner" className="bg-ink text-cream grain relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-azzurro/10 blur-[120px]" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <SectionHead
          dark
          eyebrow="Blocco 3 — Architettura a 6 dimensioni"
          title="Sei Partner"
          titleLine2="Co-Promotori"
          number="04"
          lead="Ogni Partner è descritto secondo sei dimensioni: Ruolo, Contributo Diretto, Co-Investimento Startup, Spillover Generato, Spillover Ricevuto e Beneficio Netto."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {/* Lista selettore */}
          <div className="lg:col-span-4">
            <ul role="tablist" aria-label="Partner Co-Promotori" className="border-t border-cream/15">
              {PARTNERS.map((pp) => {
                const on = pp.id === sel;
                return (
                  <li key={pp.id} className="border-b border-cream/15">
                    <button
                      role="tab"
                      aria-selected={on}
                      onClick={() => setSel(pp.id)}
                      className={cn('group flex w-full items-center gap-4 py-4 text-left transition-all duration-300', on ? 'text-cream' : 'text-cream/50 hover:text-cream/85')}
                    >
                      <span className="font-mono text-[11px] opacity-60">0{pp.id}</span>
                      <span className={cn('flex-1 text-base md:text-lg font-medium tracking-tight transition-transform duration-300', on && 'translate-x-2')}>{pp.name}</span>
                      <span className={cn('h-px bg-azzurro-2 transition-all duration-500', on ? 'w-10' : 'w-0 group-hover:w-4')} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="eyebrow mt-6 text-cream/40">Nomi commerciali anonimizzati: Co-promotori (Gruppo ILL) e (Gruppo EXE)</p>
          </div>

          {/* Scheda */}
          <div className="lg:col-span-8" role="tabpanel">
            <div key={sel} className="rounded-2xl border border-cream/10 bg-ink-2/70 p-6 md:p-10 animate-[fadeIn_.5s_ease]">
              <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="eyebrow text-azzurro-2">{p.sub}</div>
                  <h3 className="display mt-3 text-3xl md:text-5xl">{p.name}</h3>
                </div>
                <span className="eyebrow rounded-full border border-cream/20 px-3 py-1.5 text-cream/70">Binario {p.track}</span>
              </div>
              <dl className="mt-8 divide-y divide-cream/10 border-t border-cream/10">
                {DIMS.map((dim, i) => (
                  <div key={dim.key} className="grid gap-2 py-4 md:grid-cols-12" style={{ animation: `fadeIn .5s ease ${i * 60}ms both` }}>
                    <dt className="md:col-span-4 flex items-baseline gap-2 text-sm font-medium">
                      <sup className="text-[9px] opacity-50">{i + 1}</sup>
                      {dim.label}
                      {dim.sym && <span className="font-mono text-[10px] text-cream/40">{dim.sym}</span>}
                    </dt>
                    <dd className="md:col-span-8 text-sm leading-relaxed text-cream/70">{d[dim.key]}</dd>
                  </div>
                ))}
              </dl>
              {sel === 3 && (
                <p className="mt-6 rounded-xl border border-azzurro/30 bg-azzurro/10 px-4 py-3 text-xs text-cream/80">
                  Guardrail: le Aziende Pubbliche <strong className="font-medium">non finanziano</strong> il progetto. Il loro unico apporto è il Voucher Welfare ai propri addetti.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Benchmark istituzionali                                             */
/* ------------------------------------------------------------------ */
export function Benchmark() {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <SectionHead
          eyebrow="Blocco 4 — Benchmark e convergenza degli spillover pubblici"
          title="Costo per"
          titleLine2="Outcome"
          number="05"
          lead="Il confronto con gli strumenti regionali esistenti fissa la regola di efficienza: la Regione sostiene un decimo del benchmark e incassa gratuitamente gli spillover dell'ecosistema."
        />

        <div className="mt-16 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
          <Reveal className="bg-paper p-8 md:p-10">
            <div className="eyebrow text-ink/50">Benchmark culturale</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">MarcheStorie</h3>
            <p className="mt-3 text-sm text-ink/65 leading-relaxed">10.000 € Regione + 3.000 € Ente Locale per singolo Comune. Su un'Unione di almeno 8 Comuni:</p>
            <div className="mt-6 font-mono text-sm">10.000 € × 8 =</div>
            <div className="text-4xl md:text-5xl font-semibold tracking-tighter tabular">80.000 €</div>
            <div className="eyebrow mt-1 text-ink/45">per Unione</div>
          </Reveal>
          <Reveal delay={100} className="bg-paper p-8 md:p-10">
            <div className="eyebrow text-ink/50">Benchmark digitalizzazione</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">Voucher PID</h3>
            <p className="mt-3 text-sm text-ink/65 leading-relaxed">7.000 € incentivo pubblico + 3.000 € co-finanziamento PMI + 4.000 € costi di gestione pubblici.</p>
            <div className="mt-6 font-mono text-sm">14.000 €/PMI, di cui pubblici</div>
            <div className="text-4xl md:text-5xl font-semibold tracking-tighter tabular">11.000 €</div>
            <div className="eyebrow mt-1 text-ink/45">costo pubblico per PMI</div>
          </Reveal>
          <Reveal delay={200} className="bg-ink text-cream p-8 md:p-10 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-azzurro/30 blur-3xl" aria-hidden />
            <div className="eyebrow text-cream/50">Regola del Costo per Outcome</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">Regione Marche</h3>
            <div className="mt-6 rounded-xl border border-cream/15 bg-ink-2 p-4 font-mono text-[11px] sm:text-xs leading-loose overflow-x-auto">
              <div className="text-cream/60 whitespace-nowrap">Benchmark = MarcheStorie + PID</div>
              <div className="mt-2 flex items-center gap-2 whitespace-nowrap">
                <span className="whitespace-nowrap">Costo per Outcome =</span>
                <span className="inline-flex flex-col items-center leading-tight">
                  <span className="border-b border-cream/60 px-1.5 pb-0.5 whitespace-nowrap">MarcheStorie + PID</span>
                  <span className="pt-0.5">10</span>
                </span>
              </div>
            </div>
            <div className="mt-6 text-4xl md:text-5xl font-semibold tracking-tighter tabular">10×</div>
            <div className="eyebrow mt-1 text-cream/50">efficienza diretta + effetto spillover</div>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-8 text-sm text-ink/60 max-w-3xl leading-relaxed">
          A questa efficienza diretta si somma l'effetto spillover: Regione Marche e Unioni di Comuni incassano gratuitamente i risultati delle campagne Media CSR, della piattaforma Welfare Shared Value e dell'indotto turistico-agroalimentare generato dai Partner privati e pubblici.
        </Reveal>
      </div>
    </section>
  );
}
