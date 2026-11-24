import { useState, type FormEvent } from 'react';
import { cn } from '../utils/cn';
import { CountUp, Logo, Marquee, NumberedStrip, PillButton, Reveal, SectionHead } from './ui';
import { PARTNERS } from '../lib/model';

/* ------------------------------------------------------------------ */
/* Blocco 5 — Indicatori Progetto Pilota                                */
/* ------------------------------------------------------------------ */
const INDICATORS = [
  { area: 'Attività nelle destinazioni', input: '8 spettacoli + 4 eventi culturali con imprese locali', out: '15.000 appassionati attivati · 1.000 membership "vota lo spettacolo"' },
  { area: 'Contest & coinvolgimento (Binario 2)', input: '1 Contest con micro-influencer (1.000.000 utenti raggiunti) + 1.000.000 impression Media Earned', out: 'Crescita organica community e database sostenitori' },
  { area: 'Campagne di valorizzazione', input: 'Budget Media 25.000 € + Budget Startup 50.000 € → 10.000.000 impression garantite (3,5 M Video YouTube · 4,5 M Display retargeting · 2 M Google AI Max / Performance Max)', out: '8.000 nuove membership · 2.000 membri Tornei Hub & Spoke · 1.000 turisti culturali fisicamente attratti' },
  { area: 'Infrastruttura e digitalizzazione territoriale', input: 'Tecnologie MarTech e maturità digitale per 20 micro-imprese + Web Hub Destinazione + Filiera Km 0', out: 'Asset digitale permanente · vendite dirette > 50.000 € (stima studio di fattibilità) · nuovo mercato consegne dirette a costo trasporto zero' },
  { area: 'PR & Network', input: '50 operatori danza · 15 giornalisti in giuria · 25 articoli stampa · 10 testate affiliate marketing', out: 'Posizionamento reputazionale nazionale' },
  { area: 'Marketing digitale (Lead Magnet)', input: '1 Book Comunicazione (10.000 contatti Istituzioni/Giornalisti) + 1 Rivista mensile (50.000 contatti · 600.000 invii/anno)', out: 'Nurturing continuo oltre l\'evento' },
];

export function Indicators() {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <SectionHead
          eyebrow="Blocco 5 — Criteri di valutazione del Progetto Pilota"
          title="Indicatori"
          titleLine2="Monti Azzurri"
          number="07"
          lead="Ogni area di attività è legata a output misurabili. È la base del contratto a Performance Garantita con l'Unione e della rendicontazione Evidence-Based verso la Regione."
        />
        <div className="mt-16 border-t border-ink/15">
          <div className="hidden md:grid grid-cols-12 gap-6 py-3 eyebrow text-ink/45">
            <div className="col-span-3">Area</div>
            <div className="col-span-5">Attività / Input</div>
            <div className="col-span-4">Output attesi</div>
          </div>
          {INDICATORS.map((r, i) => (
            <Reveal key={i} delay={i * 60} className="group grid gap-3 border-t border-ink/10 py-6 md:grid-cols-12 md:gap-6 md:py-7 transition-colors hover:bg-paper-2/60 md:px-2 md:-mx-2">
              <div className="md:col-span-3 flex items-start gap-3 font-medium tracking-tight">
                <sup className="mt-1 font-mono text-[10px] opacity-50">{i + 1}</sup>
                <span className="text-base md:text-lg leading-snug">{r.area}</span>
              </div>
              <p className="md:col-span-5 text-sm leading-relaxed text-ink/65">{r.input}</p>
              <p className="md:col-span-4 text-sm leading-relaxed">
                <svg className="mr-2 inline h-3.5 w-3.5 -translate-y-px text-azzurro" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                {r.out}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Blocco 6 — Impatto a regime                                          */
/* ------------------------------------------------------------------ */
export function Impact() {
  return (
    <section id="impatto" className="relative isolate overflow-hidden text-cream">
      <img src="/images/sibillini.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-ink/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" />
      <div className="relative mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <SectionHead
          dark
          eyebrow="Blocco 6 — Prospettiva 1: 200 Imprese Partner a regime"
          title="Impatto"
          titleLine2="economico-sociale"
          number="08"
          lead="Parametri: 200 imprese × 40 addetti = 8.000 lavoratori. Flussi monetizzabili diretti tenuti rigorosamente distinti dal valore indotto non monetizzabile."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="eyebrow mb-4 text-cream/50">Flussi monetizzabili diretti / anno</div>
            <ul className="divide-y divide-cream/10 border-y border-cream/10">
              {[
                ['Ricettività', '22% = 1.760 addetti · dipendente + accompagnatore stessa notte = 3.520 presenze · voucher 50 € · zero seconde notti', '88.000 € voucher + 88.000 € spesa privata', 176000],
                ['Ristorazione', '32% = 2.560 addetti · dipendente + accompagnatore = 5.120 presenze · voucher 25 €', '64.000 € voucher + 64.000 € spesa privata', 128000],
                ['Matching Grant culturale Startup', '1:1 sul solo pernottamento: 50 € = 25 + 25 € per coppia su 1.760 soggiorni', 'biglietto spettacolo e servizi locali', 88000],
                ['Store Km 0', '15% = 1.200 addetti · 6 ordini/anno · scontrino 30 €', 'costo trasporto 0 € · > 50 km evitati/ordine · 0,29 kg CO₂/km risparmiati', 216000],
              ].map(([h, d, s, v], i) => (
                <Reveal as="li" key={i} delay={i * 70} className="grid gap-2 py-5 sm:grid-cols-12 sm:items-start">
                  <div className="sm:col-span-4 flex items-start gap-2 font-medium"><sup className="mt-1 font-mono text-[10px] opacity-50">{i + 1}</sup>{h as string}</div>
                  <div className="sm:col-span-5 text-[12.5px] leading-relaxed text-cream/60">{d as string}<br /><span className="text-cream/40">{s as string}</span></div>
                  <div className="sm:col-span-3 text-right font-mono text-lg tabular">{new Intl.NumberFormat('it-IT').format(v as number)} €</div>
                </Reveal>
              ))}
            </ul>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl glass-dark p-5">
                <div className="eyebrow text-cream/50">Spesa turistica e culturale diretta (V_tur)</div>
                <div className="mt-2 text-3xl font-semibold tabular tracking-tight">392.000 €</div>
                <div className="text-[11px] text-cream/45">176.000 + 128.000 + 88.000 / anno</div>
              </div>
              <div className="rounded-2xl glass-dark p-5">
                <div className="eyebrow text-cream/50">Spesa diretta complessiva (Turismo + Km 0)</div>
                <div className="mt-2 text-3xl font-semibold tabular tracking-tight">608.000 €</div>
                <div className="text-[11px] text-cream/45">392.000 + 216.000 / anno</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <Reveal className="rounded-2xl border border-azzurro/40 bg-azzurro/10 p-6 backdrop-blur-md">
              <div className="eyebrow text-azzurro-2">Valore non monetizzabile & indotto</div>
              <div className="mt-3 text-5xl md:text-6xl font-semibold tracking-tighter tabular">
                <CountUp to={1.16} prefix="≈ " suffix=" M€" decimals={2} />
              </div>
              <p className="mt-3 text-sm text-cream/70 leading-relaxed">
                Valore Territoriale Globale diretto / anno: componente turistico-culturale × moltiplicatore Università Tor Vergata per il Ministero del Turismo
                (392.000 € × 2,408 = 943.936 €) + filiera Km 0 (216.000 €).
              </p>
              <p className="mt-2 text-[12px] text-cream/50">Oltre 1,9 – 2,3 M€ considerando l'indotto esteso multi-stakeholder.</p>
            </Reveal>
            <Reveal delay={100} className="rounded-2xl glass-dark p-6">
              <div className="eyebrow text-cream/50">Leva operativa Startup (SROI implicito)</div>
              <div className="mt-3 text-5xl font-semibold tracking-tighter tabular">5,3× – 6,4×</div>
              <p className="mt-3 text-sm text-cream/65">A fronte di 361.000 € di costi complessivi della Startup (100.000 € 3 FTE + 88.000 € Matching Grant + 50.000 € Adtech + 90.000 € Martech + 11.000 € 10 PMI Monti Azzurri + 22.000 € 20 PMI Marche).</p>
            </Reveal>
            <Reveal delay={180} className="rounded-2xl glass-dark p-6">
              <div className="eyebrow text-cream/50">CO₂ evitata (Km 0)</div>
              <div className="mt-3 text-4xl font-semibold tracking-tighter tabular"><CountUp to={104.4} suffix=" t" decimals={1} /></div>
              <p className="mt-2 text-[12px] text-cream/50">8.000 lavoratori × 13,05 kg — 7.200 ordini × 50 km × 0,29 kg/km</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Blocco 7 — 7 asset infrastruttura CSR                                */
/* ------------------------------------------------------------------ */
const ASSETS = [
  ['Analisi strategica', 'Mappatura degli asset core dell\'impresa per lo Shared Value.'],
  ['Comunicazione integrata', 'Infrastruttura di comunicazione e storytelling multimediale.'],
  ['Web Space Monitoraggio Impatto', 'Indotto, presenze, kg Km 0, CO₂ abbattuta, beneficiari locali.'],
  ['Web Space Best Practice', 'Risultati validati da terze parti.'],
  ['Web Space Reporting Integrato', 'Conforme a IFRS (Integrated Reporting Framework), indicatori WICI (capitale intangibile) e direttiva europea CSRD / ESRS.'],
  ['Web Space Media Kit', 'Media Kit & Conferenze Stampa Online.'],
  ['Web Space Partenariato PA', 'Partenariato con la PA & documenti di Evidence-Based Policy.'],
];

export function Infrastructure() {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <SectionHead
          eyebrow="Blocco 7 — Prospettiva 2: infrastruttura di abilitazione CSR Shared Value"
          title="Sette asset"
          titleLine2="per le imprese"
          number="09"
          lead="Asset digitali e strategici forniti alle imprese aderenti, che certificano anche lo Spillover Out-Flow sulla catena del valore."
        />
        <div className="mt-16 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {ASSETS.map(([h, d], i) => (
            <Reveal key={i} delay={i * 60} className={cn('group relative bg-paper p-7 transition-colors duration-500 hover:bg-ink hover:text-cream', i === 6 && 'lg:col-span-1')}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] opacity-50">0{i + 1}</span>
                <span className="h-7 w-7 rounded-full border border-current/30 flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M8 7h9v9" /></svg>
                </span>
              </div>
              <h3 className="mt-10 text-lg font-semibold tracking-tight leading-snug">{h}</h3>
              <p className="mt-3 text-sm leading-relaxed opacity-65">{d}</p>
            </Reveal>
          ))}
          <Reveal delay={420} className="bg-ink text-cream p-7 flex flex-col justify-between">
            <div className="eyebrow text-cream/50">Standard di rendicontazione</div>
            <div className="mt-6 space-y-2 text-2xl font-semibold tracking-tight">
              <div>IFRS · IR</div><div>WICI</div><div>CSRD / ESRS</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Roadmap: Pilota → 4 Province                                         */
/* ------------------------------------------------------------------ */
const PROVINCES = ['Ancona', 'Pesaro-Urbino', 'Fermo', 'Ascoli Piceno'];

export function Roadmap() {
  return (
    <section className="bg-ink text-cream grain relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 top-10 h-[30rem] w-[30rem] rounded-full bg-azzurro/15 blur-[140px] animate-float" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <SectionHead
          dark
          eyebrow="Governance e scalabilità"
          title="Dal Pilota"
          titleLine2="alla Regione"
          number="10"
          lead="L'Unione dei Monti Azzurri avvia il Pilota; la Regione Marche co-promuove lo sviluppo successivo in altre quattro Province replicando lo stesso stato di calcolo, la stessa matrice e la stessa infrastruttura digitale."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:items-stretch">
          <Reveal className="lg:col-span-5 relative overflow-hidden rounded-2xl">
            <img src="/images/borgo-teatro.jpg" alt="Borgo delle Aree Interne marchigiane con teatro storico all'ora blu" loading="lazy" className="h-full min-h-[320px] w-full object-cover transition-transform duration-[2000ms] hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute bottom-0 p-6 md:p-8">
              <div className="eyebrow text-cream/60">Fase 1 · Pilota</div>
              <div className="display mt-2 text-3xl md:text-4xl">Unione dei<br />Monti Azzurri</div>
              <p className="mt-3 max-w-xs text-sm text-cream/70">8 Comuni · 6–8 spettacoli · 10 micro-imprese digitalizzate · contratto a Performance Garantita.</p>
            </div>
          </Reveal>

          <div className="lg:col-span-7 flex flex-col">
            <div className="eyebrow text-cream/50">Fase 2 · Sviluppo regionale — Co-promotore Regione Marche</div>
            <ul className="mt-4 border-t border-cream/15">
              {PROVINCES.map((p, i) => (
                <Reveal as="li" key={p} delay={i * 90} className="group flex items-center justify-between gap-6 border-b border-cream/15 py-5 md:py-6">
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-xs text-cream/40">0{i + 2}</span>
                    <span className="display text-3xl md:text-5xl transition-transform duration-500 group-hover:translate-x-3">{p}</span>
                  </div>
                  <span className="eyebrow hidden sm:inline text-cream/45">Provincia · Unioni di Comuni candidate</span>
                </Reveal>
              ))}
            </ul>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ['4 Unioni × 8 Comuni', 'perimetro regionale default del simulatore'],
                ['20 PMI', '5 PMI/Unione · media prudenziale'],
                ['540.000 €', 'benchmark MarcheStorie + PID · costo Regione 54.000 €'],
              ].map(([k, v], i) => (
                <div key={i} className="rounded-2xl border border-cream/10 p-4">
                  <div className="text-xl font-semibold tabular tracking-tight">{k}</div>
                  <div className="mt-1 text-[11px] text-cream/50">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Marquee text="Ancona · Pesaro-Urbino · Fermo · Ascoli Piceno — stesso stato di calcolo, stessa matrice, stessa infrastruttura digitale" className="text-cream/70" slow />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonianze (ruoli anonimizzati)                                   */
/* ------------------------------------------------------------------ */
const QUOTES = [
  { q: 'Per la prima volta un modello ci mostra, cifra per cifra, come il teatro del nostro borgo diventi un asset che lavora anche quando il sipario è chiuso.', who: 'Presidente', org: 'Unione di Comuni — Aree Interne' },
  { q: 'Il Costo per Outcome a un decimo del benchmark e la matrice di spillover rendono la valutazione Evidence-Based immediata: sappiamo cosa misurare e perché.', who: 'Dirigente Cultura e Turismo', org: 'Amministrazione regionale' },
  { q: 'Il nostro budget media non compra più solo impression: diventa domanda reale per strutture locali, rendicontabile in chiave CSRD.', who: 'CSR & Brand Manager', org: 'Co-promotore (Gruppo ILL)' },
  { q: 'Zero costi fissi, Cause Related Marketing in e-commerce as a service e una filiera Km 0 che genera reddito locale misurabile. È shared value, non sponsorizzazione.', who: 'Direzione Sviluppo', org: 'Co-promotore (Gruppo EXE)' },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <SectionHead eyebrow="Voci dei tavoli multi-stakeholder" title="Cosa dicono" titleLine2="i Co-Promotori" number="11" />
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div key={i} className="animate-[kpi_.5s_ease]">
              <svg className="h-8 w-8 text-ink/20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7.2 11H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6.5c0 2.9-1.6 4.9-4.6 5.5l-.4-1.3c1.9-.5 3-1.6 3.2-3.7zm10 0H14a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6.5c0 2.9-1.6 4.9-4.6 5.5l-.4-1.3c1.9-.5 3-1.6 3.2-3.7z" /></svg>
              <blockquote className="mt-6 text-2xl md:text-4xl font-light leading-tight tracking-tight">“{QUOTES[i].q}”</blockquote>
              <div className="mt-8 flex items-center gap-4">
                <span className="h-px w-10 bg-ink/40" />
                <div><div className="text-sm font-medium">{QUOTES[i].who}</div><div className="text-xs text-ink/55">{QUOTES[i].org}</div></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex lg:flex-col gap-2 lg:justify-end">
            {QUOTES.map((q, k) => (
              <button key={k} type="button" onClick={() => setI(k)} aria-label={`Testimonianza ${k + 1}: ${q.org}`} aria-pressed={i === k}
                className={cn('flex-1 lg:flex-none text-left rounded-xl border px-4 py-3 text-xs transition-all duration-300', i === k ? 'border-ink bg-ink text-cream' : 'border-ink/15 hover:border-ink/40')}>
                <div className="font-mono text-[10px] opacity-60">0{k + 1}</div>
                <div className="mt-1 hidden sm:block">{q.org}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */
const FAQS = [
  ['Le Aziende Pubbliche (Università, ASL) finanziano il progetto?', 'No. Erogano esclusivamente Voucher Welfare Aziendale ai propri addetti (max 75 €). Con una redenzione ottimistica del 20%, il costo medio effettivo è di 15 €/addetto. Nessun trasferimento al progetto.'],
  ['Come funziona il Matching Grant della Startup?', 'È pari a 50 € (25 € dipendente + 25 € accompagnatore), erogato 1:1 solo sui Voucher Pernottamento (22% degli addetti) per biglietto spettacolo e servizi locali. Non si applica ad aperitivi/cene né a seconde notti.'],
  ['La spesa privata degli accompagnatori è attribuita alla Startup?', 'No. Nel Profilo 6 il co-investimento della Startup (S₆) comprende solo Matching Grant sul pernottamento (MG₆) e infrastruttura tecnologica/MarTech (S_tech = 90.000 €). La spesa privata (V_priv) è calcolata ed esposta separatamente.'],
  ['Cosa misurano davvero i coefficienti α della matrice?', 'Sono indici di fruibilità di beni non rivali (campagne, piattaforme, infrastrutture condivise), non quote di ripartizione di cassa. La somma per riga può superare 1 perché misura il risparmio di duplicazione: il valore equivalente che ogni Partner avrebbe dovuto spendere per ottenere lo stesso asset da solo.'],
  ['Perché il Saldo In−Out delle Imprese Shared Value è negativo?', 'Perché agiscono da motore netto di domanda per l\'ecosistema: generano più spillover di quanti ne ricevano. Non è una perdita — la loro Leva Reale Estesa resta ampiamente positiva.'],
  ['Qual è la differenza tra Valore Economico Netto e Valore di Rete?', 'Il Valore Economico Netto Diretto è la diagonale della matrice (Σ Pᵢ). Il Valore Cumulato Fruito / di Rete aggiunge gli spillover (Σ Pᵢ + Σ In-Flow). Nella Panoramica sono sempre affiancati per evitare doppi conteggi impliciti.'],
  ['Come si passa dal Pilota alle 4 Province?', 'Il Profilo 1 rappresenta la concentrazione del pilota (10 PMI nell\'Unione dei Monti Azzurri). Il Profilo 2 usa la media prudenziale regionale (5 PMI/Unione × 4 Unioni = 20 PMI). Lo stesso stato di calcolo e la stessa infrastruttura digitale si replicano in Ancona, Pesaro-Urbino, Fermo e Ascoli Piceno.'],
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-paper text-ink border-t border-ink/10">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-16 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="Domande frequenti" title="FAQ" number="12" />
            <p className="mt-8 max-w-sm text-sm text-ink/60 leading-relaxed">Le risposte riprendono i guardrail metodologici del modello: nessuna assunzione nascosta, nessuna attribuzione impropria di risorse.</p>
          </div>
          <div className="lg:col-span-8 border-t border-ink/15">
            {FAQS.map(([q, a], i) => {
              const on = open === i;
              return (
                <div key={i} className="border-b border-ink/15">
                  <button type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on} aria-controls={`faq-${i}`} className="group flex w-full items-start justify-between gap-6 py-6 text-left">
                    <span className="flex items-start gap-4">
                      <span className="mt-1 font-mono text-[10px] text-ink/40">0{i + 1}</span>
                      <span className="text-base md:text-lg font-medium tracking-tight">{q}</span>
                    </span>
                    <span className={cn('mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/30 transition-all duration-500', on ? 'rotate-45 bg-ink text-cream' : 'group-hover:border-ink')}>
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </button>
                  <div id={`faq-${i}`} className={cn('grid transition-all duration-500 ease-out', on ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0')}>
                    <p className="overflow-hidden pl-9 text-sm leading-relaxed text-ink/65 max-w-2xl">{a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA — Blocco 8                                                      */
/* ------------------------------------------------------------------ */
export function CTA() {
  const [sent, setSent] = useState(false);
  const [partner, setPartner] = useState('1');
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <section id="dossier" className="relative isolate overflow-hidden bg-ink text-cream grain">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-azzurro/15 blur-[160px] animate-pulse-soft" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-6 py-24 md:px-16 md:py-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Reveal><div className="eyebrow text-cream/50">Blocco 8 — Azioni di coinvolgimento</div></Reveal>
            <Reveal delay={80}>
              <h2 className="display display-indent mt-6 text-5xl sm:text-7xl lg:text-8xl"><span>Entra</span><span>nella rete</span></h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-base md:text-lg text-cream/70 leading-relaxed">
                Azione primaria: esplora il Simulatore Matriciale e verifica ogni assunzione. Azione secondaria: richiedi il Dossier Tecnico profilato per il tuo ruolo di Partner Co-Promotore.
              </p>
            </Reveal>
            <Reveal delay={240}><div className="mt-10"><PillButton href="#simulatore" dark>Apri il Simulatore</PillButton></div></Reveal>
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <form onSubmit={onSubmit} className="glass-dark rounded-3xl p-6 md:p-8">
              <div className="eyebrow text-cream/50">Richiesta Dossier Tecnico profilato</div>
              {sent ? (
                <div className="mt-8 rounded-2xl border border-azzurro/40 bg-azzurro/10 p-6">
                  <div className="text-lg font-medium">Richiesta registrata.</div>
                  <p className="mt-2 text-sm text-cream/70">Il Dossier per il profilo <strong className="font-medium text-cream">{PARTNERS[Number(partner) - 1].name}</strong> sarà inviato con le formule correnti e la nota metodologica.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="cta-partner" className="text-xs text-cream/60">Profilo Partner</label>
                    <select id="cta-partner" value={partner} onChange={(e) => setPartner(e.target.value)} className="mt-1.5 w-full rounded-xl border border-cream/15 bg-ink-2 px-4 py-3 text-sm text-cream focus:border-azzurro-2 outline-none">
                      {PARTNERS.map((p) => <option key={p.id} value={p.id}>{p.id}. {p.name}</option>)}
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="cta-ente" className="text-xs text-cream/60">Ente / Impresa</label>
                      <input id="cta-ente" required className="mt-1.5 w-full rounded-xl border border-cream/15 bg-ink-2 px-4 py-3 text-sm placeholder:text-cream/30 focus:border-azzurro-2 outline-none" placeholder="Unione dei Monti Azzurri" />
                    </div>
                    <div>
                      <label htmlFor="cta-email" className="text-xs text-cream/60">Email istituzionale</label>
                      <input id="cta-email" type="email" required className="mt-1.5 w-full rounded-xl border border-cream/15 bg-ink-2 px-4 py-3 text-sm placeholder:text-cream/30 focus:border-azzurro-2 outline-none" placeholder="nome@ente.it" />
                    </div>
                  </div>
                  <PillButton type="submit" dark className="w-full justify-center">Richiedi il Dossier</PillButton>
                  <p className="text-[11px] text-cream/40">Nessun dato commerciale reale dei Co-promotori viene esposto: sigle anonimizzate (Gruppo ILL), (Gruppo EXE).</p>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
export function Footer() {
  return (
    <footer className="bg-ink text-cream border-t border-cream/10">
      <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-16">
        <NumberedStrip items={['Unioni di Comuni', 'Regione Marche', 'Aziende Pubbliche', 'Fondazione Bancaria', 'Imprese CSR', 'Imprese Shared Value']} className="text-cream/60 border-t border-cream/15" />
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-sm text-cream/55 leading-relaxed">Modello di Shared Value Esteso e Simulatore Multi-Stakeholder con Effetti Spillover. Progetto Pilota: Unione dei Monti Azzurri. Co-promotore dello sviluppo: Regione Marche — Ancona, Pesaro-Urbino, Fermo, Ascoli Piceno.</p>
          </div>
          <div className="md:col-span-3">
            <div className="eyebrow text-cream/40">Navigazione</div>
            <ul className="mt-4 space-y-2 text-sm">
              {[['#modello', 'Modello'], ['#binari', 'Doppio Binario'], ['#partner', 'Partner'], ['#simulatore', 'Simulatore'], ['#impatto', 'Impatto'], ['#faq', 'FAQ']].map(([h, l]) => (
                <li key={h}><a href={h} className="text-cream/70 hover:text-cream transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <div className="eyebrow text-cream/40">Riferimenti metodologici</div>
            <ul className="mt-4 space-y-2 text-sm text-cream/60">
              <li>Moltiplicatore Università Tor Vergata — Ministero del Turismo (2,408×)</li>
              <li>Benchmark MarcheStorie — Regione Marche</li>
              <li>Voucher PID — Camere di Commercio</li>
              <li>IFRS Integrated Reporting · WICI · CSRD / ESRS</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-cream/10 pt-6 text-[11px] text-cream/40 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Shared Value Esteso — Documento executive per tavoli istituzionali. Valori simulati con assunzioni esplicite.</span>
          <span className="eyebrow">Co-promotori anonimizzati: (Gruppo ILL) · (Gruppo EXE)</span>
        </div>
      </div>
    </footer>
  );
}
