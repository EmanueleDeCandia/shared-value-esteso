/**
 * Modello matematico del Simulatore Matriciale 6x6 — Shared Value Esteso.
 * Tutte le formule sono esposte in interfaccia (requisito anti-black-box).
 */

export const TOR_VERGATA = 2.408; // moltiplicatore macroeconomico Università Tor Vergata / Ministero del Turismo
export const S_TECH = 90_000; // infrastruttura digitale, piattaforma welfare, piattaforme e strumenti MarTech, Web Space CSRD/WICI
export const S_FONDAZIONE_TECH = 137_000; // piattaforma tecnologica Pay per Outcome / Costo per Outcome, metodi ed engagement nuovi Partner
export const PMI_UNIT_COST = 1_100; // costo digitalizzazione MarTech per micro-impresa (1/10 del benchmark PID)
export const COORD_EVENTI_PER_SPETTACOLO = 3_000; // co-investimento Startup per Coordinamento (Spettacoli) e Gestione (Eventi) per spettacolo
export const MARCHESTORIE_PER_COMUNE = 10_000;
export const PID_PUBLIC_PER_PMI = 11_000;

export type PartnerId = 1 | 2 | 3 | 4 | 5 | 6;

export interface SimState {
  // Profilo 1 — Unioni di Comuni (Pilota Monti Azzurri + 4 Unioni)
  nSpett1: number;
  cUnione: number;
  nPmi1: number;
  sovReg: number; // Costo Nuova Sovvenzione richiesta alla Regione Marche (1.000–9.000 €)
  // Profilo 2 — Regione Marche
  nUnioni: number;
  nCom: number;
  nPmi2: number;
  // Profilo 3 — Aziende Pubbliche
  nAdd: number;
  vNom: number;
  tRed: number; // percent (5–30)
  // Profilo 4 — Fondazione Bancaria
  nSpett4: number;
  cOut: number;
  // Profilo 5 — Impresa CSR Media
  bMedia: number;
  // Profilo 6 — Imprese Shared Value
  nImp: number;
  nDip: number;
  km0: boolean;
  // Controllo scenari
  active: Record<PartnerId, boolean>;
  networkEffect: boolean;
}

export const DEFAULT_STATE: SimState = {
  nSpett1: 6,
  cUnione: 3000,
  nPmi1: 10,
  sovReg: 3000,
  nUnioni: 4,
  nCom: 8,
  nPmi2: 5,
  nAdd: 2500,
  vNom: 75,
  tRed: 20,
  nSpett4: 20,
  cOut: 3000,
  bMedia: 25000,
  nImp: 50,
  nDip: 40,
  km0: true,
  active: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
  networkEffect: true,
};

export interface PartnerMeta {
  id: PartnerId;
  short: string;
  name: string;
  sub: string;
  track: 1 | 2;
  role: string;
}

export const PARTNERS: PartnerMeta[] = [
  { id: 1, short: 'Unioni', name: 'Unioni di Comuni', sub: 'Pilota Monti Azzurri (10 PMI) + 4 Unioni (5 PMI/Unione)', track: 1, role: 'Luoghi, palcoscenici, ospitalità' },
  { id: 2, short: 'Regione', name: 'Regione Marche', sub: 'Co-promotore dello sviluppo in 4 Province', track: 2, role: 'Legittimazione e cornice territoriale' },
  { id: 3, short: 'Az. Pubbliche', name: 'Aziende Pubbliche', sub: 'Università, Aziende Sanitarie', track: 1, role: 'Solo Voucher Welfare ai propri addetti' },
  { id: 4, short: 'Fondazione', name: 'Fondazione Bancaria', sub: 'Pay per Outcome: Spettacoli aggiuntivi (non coperti da sovvenzioni pubbliche) del giorno successivo', track: 1, role: 'Produzione culturale e Matching Grant' },
  { id: 5, short: 'CSR Media', name: 'Imprese CSR', sub: 'Branding istituzionale — Budget Media', track: 2, role: 'Traffico qualificato e posizionamento' },
  { id: 6, short: 'Shared Value', name: 'Imprese Shared Value', sub: 'Co-promotori (Gruppo ILL), (Gruppo EXE), Rete PMI CSR', track: 1, role: 'Motore netto di domanda e infrastruttura' },
];

/** Coefficienti di assorbimento α(i→j) — indici di fruibilità di beni non rivali */
export const ALPHA: number[][] = [
  [0, 0.4, 0.25, 0.3, 0.2, 0.3],
  [0.5, 0, 0.1, 0.1, 0.15, 0.15], // Regione Marche: somma = 1,00
  [0.6, 0.5, 0, 0.2, 0.15, 0.15],
  [0.5, 0.45, 0.25, 0, 0.25, 0.3],
  [0.7, 0.75, 0.2, 0.45, 0, 0.4],
  [0.65, 0.6, 0.35, 0.3, 0.3, 0],
];

export interface FormulaRow {
  code?: string;
  label: string;
  formula: string;
  value: number;
  unit?: '€' | 'n' | 'kg' | '%' | 'x';
  highlight?: boolean;
}

export interface ProfileResult {
  id: PartnerId;
  C: number;
  S: number;
  P: number;
  formulas: FormulaRow[];
}

export interface PartnerOutput extends ProfileResult {
  active: boolean;
  inFlow: number;
  outFlow: number;
  saldo: number;
  vEsteso: number;
  levaDiretta: number;
  levaEstesa: number;
}

export interface SimResult {
  partners: PartnerOutput[];
  matrix: number[][]; // M[i][j]
  cEco: number;
  pEco: number;
  spEco: number;
  vRete: number;
  lDiretta: number;
  lEco: number;
  unioniSplit: {
    pilota: { C: number; S: number; P: number; formulas: FormulaRow[] };
    altre: { C: number; S: number; P: number; formulas: FormulaRow[] };
  };
  extra: {
    W: number;
    co2: number;
    bMS: number;
    bPID: number;
    nBen: number;
    impressions: number;
  };
}

const safeDiv = (a: number, b: number) => (b > 0 ? a / b : 0);

export function computeProfiles(s: SimState): {
  profiles: ProfileResult[];
  unioniSplit: SimResult['unioniSplit'];
  extra: SimResult['extra'];
} {
  // 1a — Unione Monti Azzurri (Pilota, 100% su P1a perché escluso da P2)
  const C1pilota = s.nSpett1 * s.cUnione; // Unico esborso Unione: Costo per Outcome → entrata Startup
  const S1pmiPilota = s.nPmi1 * PMI_UNIT_COST; // 1/10 PID Pilota (10 PMI)
  const S1coordPilota = s.nSpett1 * COORD_EVENTI_PER_SPETTACOLO; // Coordinamento (Spettacoli) + Gestione (Eventi)
  const S1pilota = S1pmiPilota + S1coordPilota;
  const Sov1pilota = s.nCom * s.sovReg; // Entrata Comuni da Regione Marche (non esborso Comuni)
  const R_MS_pilota = s.nCom * Math.max(0, 9_000 - s.sovReg); // Risparmio Pubblico MarcheStorie (9.000 - Sov_reg)
  const R_PID_pilota = s.nPmi1 * (PID_PUBLIC_PER_PMI - PMI_UNIT_COST); // Risparmio Pubblico PID (9/10)
  const P1pilota = C1pilota + S1pilota + R_MS_pilota + R_PID_pilota;

  // 1b — Altre Unioni di Comuni (4 Unioni, Risparmio Pubblico ripartito 50/50 tra P1b e P2)
  const C1unioni = s.nUnioni * s.nSpett1 * s.cUnione; // Unico esborso Unioni: Costo per Outcome → entrata Startup
  const S1pmiUnioni = s.nUnioni * s.nPmi2 * PMI_UNIT_COST; // 1/10 PID (5 PMI/Unione)
  const S1coordUnioni = s.nUnioni * s.nSpett1 * COORD_EVENTI_PER_SPETTACOLO;
  const S1unioni = S1pmiUnioni + S1coordUnioni;
  const Sov1unioni = s.nUnioni * s.nCom * s.sovReg; // Entrata Comuni da Regione Marche
  const R_MS_unioni = s.nUnioni * s.nCom * Math.max(0, 9_000 - s.sovReg);
  const R_PID_unioni = s.nUnioni * s.nPmi2 * (PID_PUBLIC_PER_PMI - PMI_UNIT_COST);
  const R_unioni_50 = (R_MS_unioni + R_PID_unioni) * 0.5; // 50% attribuito alle Unioni (zero doppio conteggio)
  const P1unioni = C1unioni + S1unioni + R_unioni_50;

  // Aggregato Profilo 1 per Matrice 6×6 e Sankey
  const C1 = C1pilota + C1unioni;
  const S1 = S1pilota + S1unioni;
  const P1 = P1pilota + P1unioni;

  // Profilo 2 — Regione Marche (esborso = 1/10 Startup + Sov_reg verso i Comuni; risparmio = 50% sulle 4 Unioni)
  const bMS = s.nUnioni * s.nCom * MARCHESTORIE_PER_COMUNE;
  const bPID = s.nUnioni * s.nPmi2 * PID_PUBLIC_PER_PMI;
  const C2base = (bMS + bPID) / 10; // 1/10 quota Startup coperta da Regione
  const SovTot = Sov1pilota + Sov1unioni; // Esborso Regione Marche verso i Comuni
  const C2 = C2base + SovTot;
  const S2 = R_unioni_50; // 50% Risparmio pubblico sulle 4 Unioni (altro 50% è in P1b)
  const P2 = C2base + S2;

  // Profilo 3
  const nBen = s.nAdd * (s.tRed / 100);
  const C3 = nBen * s.vNom;
  const S3 = C3;
  const P3 = (C3 + S3) * TOR_VERGATA;

  // Profilo 4 — Fondazione Bancaria
  const C4 = s.nSpett4 * s.cOut;
  const S4coord = s.nSpett4 * COORD_EVENTI_PER_SPETTACOLO;
  const S4 = S4coord + S_FONDAZIONE_TECH;
  const P4 = C4 + S4;

  // Profilo 5
  const C5 = s.bMedia;
  const S5 = s.bMedia * 2;
  const P5 = C5 + S5;

  // Profilo 6
  const W = s.nImp * s.nDip;
  const C6hotel = W * 0.22 * 50;
  const C6food = W * 0.32 * 25;
  const C6 = C6hotel + C6food;
  const MG6 = C6hotel;
  const S6 = MG6 + S_TECH;
  const Vpriv = W * 11 + W * 8;
  const Vtur = C6 + Vpriv + MG6;
  const Vkm0 = s.km0 ? W * 0.15 * 6 * 30 : 0;
  const co2 = s.km0 ? W * 0.15 * 6 * (50 * 0.29) : 0;
  const P6 = Vtur * TOR_VERGATA + Vkm0 + S_TECH;

  const unioniSplit: SimResult['unioniSplit'] = {
    pilota: {
      C: C1pilota,
      S: S1pilota,
      P: P1pilota,
      formulas: [
        { code: 'C₁a', label: 'Esborso Pilota / Costo per Outcome (→ Startup)', formula: `${s.nSpett1} spett. × ${fmt(s.cUnione)} €`, value: C1pilota, unit: '€' },
        { code: 'S₁a,pmi', label: `Digitalizzazione PMI Pilota (${s.nPmi1} PMI × 1/10 PID)`, formula: `${s.nPmi1} × 1.100 €`, value: S1pmiPilota, unit: '€' },
        { code: 'S₁a,coord', label: 'Coordinamento Spettacoli + Gestione Eventi (Startup)', formula: `${s.nSpett1} spett. × 3.000 €`, value: S1coordPilota, unit: '€' },
        { code: 'R_MS', label: 'Risparmio Pubblico MarcheStorie (9.000 − Sov_reg)', formula: `${s.nCom} Comuni × ${fmt(Math.max(0, 9_000 - s.sovReg))} €`, value: R_MS_pilota, unit: '€' },
        { code: 'R_PID', label: 'Risparmio Pubblico PID (9/10)', formula: `${s.nPmi1} PMI × 9.900 €`, value: R_PID_pilota, unit: '€' },
        { code: 'P₁a', label: 'Pool Abilitato Pilota', formula: 'C₁a + S₁a,pmi + S₁a,coord + R_MS + R_PID', value: P1pilota, unit: '€', highlight: true },
      ],
    },
    altre: {
      C: C1unioni,
      S: S1unioni,
      P: P1unioni,
      formulas: [
        { code: 'C₁b', label: `Esborso ${s.nUnioni} Unioni / Costo per Outcome (→ Startup)`, formula: `${s.nUnioni} Unioni × ${s.nSpett1} spett. × ${fmt(s.cUnione)} €`, value: C1unioni, unit: '€' },
        { code: 'S₁b,pmi', label: `Digitalizzazione PMI (${s.nUnioni} × ${s.nPmi2} PMI × 1/10 PID)`, formula: `${s.nUnioni * s.nPmi2} PMI × 1.100 €`, value: S1pmiUnioni, unit: '€' },
        { code: 'S₁b,coord', label: 'Coordinamento Spettacoli + Gestione Eventi (Startup)', formula: `${s.nUnioni} Unioni × ${s.nSpett1} spett. × 3.000 €`, value: S1coordUnioni, unit: '€' },
        { code: 'R_MS,50%', label: 'Risparmio Pubblico MarcheStorie (50% quota Unioni)', formula: `50% × ${s.nUnioni * s.nCom} Comuni × ${fmt(Math.max(0, 9_000 - s.sovReg))} €`, value: R_MS_unioni * 0.5, unit: '€' },
        { code: 'R_PID,50%', label: 'Risparmio Pubblico PID (50% quota Unioni)', formula: `50% × ${s.nUnioni * s.nPmi2} PMI × 9.900 €`, value: R_PID_unioni * 0.5, unit: '€' },
        { code: 'P₁b', label: `Pool Abilitato ${s.nUnioni} Unioni`, formula: 'C₁b + S₁b,pmi + S₁b,coord + R_MS,50% + R_PID,50%', value: P1unioni, unit: '€', highlight: true },
      ],
    },
  };

  const profiles: ProfileResult[] = [
    {
      id: 1, C: C1, S: S1, P: P1,
      formulas: [...unioniSplit.pilota.formulas],
    },
    {
      id: 2, C: C2, S: S2, P: P2,
      formulas: [
        { code: 'B_MS', label: 'Benchmark MarcheStorie', formula: `N_unioni × N_com × 10.000 € = ${s.nUnioni} × ${s.nCom} × 10.000`, value: bMS, unit: '€' },
        { code: 'B_PID', label: 'Benchmark PID', formula: `N_unioni × N_pmi × 11.000 € = ${s.nUnioni} × ${s.nPmi2} × 11.000`, value: bPID, unit: '€' },
        { code: 'C₂,base', label: 'Quota Startup coperta da Regione (1/10 → Startup)', formula: '1.000 €/Comune + 1.100 €/PMI = (B_MS + B_PID) / 10', value: C2base, unit: '€' },
        { code: 'Sov_reg', label: 'Sovvenzioni erogate ai Comuni (esborso Regione)', formula: `${(1 + s.nUnioni) * s.nCom} Comuni × ${fmt(s.sovReg)} €`, value: SovTot, unit: '€' },
        { code: 'C₂', label: 'Esborso complessivo Regione Marche', formula: 'C₂,base + Sov_reg', value: C2, unit: '€' },
        { code: 'S₂', label: 'Risparmio pubblico attribuito a Regione (50% 4 Unioni)', formula: '50% × (R_MS,unioni + R_PID,unioni)', value: S2, unit: '€' },
        { code: 'P₂', label: 'Pool Abilitato (senza doppio conteggio)', formula: 'C₂,base + S₂', value: P2, unit: '€', highlight: true },
      ],
    },
    {
      id: 3, C: C3, S: S3, P: P3,
      formulas: [
        { code: 'N_ben', label: 'Beneficiari effettivi', formula: `N_add × T_red = ${fmt(s.nAdd)} × ${s.tRed}%`, value: nBen, unit: 'n' },
        { code: 'C₃', label: 'Voucher Welfare redenti', formula: `N_ben × V_nom = ${fmt(nBen)} × ${s.vNom} €  (≈ ${fmtDec(safeDiv(C3, s.nAdd))} €/addetto)`, value: C3, unit: '€' },
        { code: 'S₃', label: 'Matching Grant 100% Startup', formula: 'S₃ = C₃', value: S3, unit: '€' },
        { code: 'P₃', label: 'Pool Abilitato', formula: '(C₃ + S₃) × 2,408 (Tor Vergata)', value: P3, unit: '€', highlight: true },
      ],
    },
    {
      id: 4, C: C4, S: S4, P: P4,
      formulas: [
        { code: 'C₄', label: 'Pay per Outcome: spettacoli aggiuntivi giorno successivo', formula: `N_spett × C_out = ${s.nSpett4} × ${fmt(s.cOut)}`, value: C4, unit: '€' },
        { code: 'S₄,coord', label: 'Coordinamento Spettacoli + Gestione Eventi (Startup)', formula: `${s.nSpett4} spett. × 3.000 €`, value: S4coord, unit: '€' },
        { code: 'S₄,tech', label: 'Piattaforma Pay per Outcome, metodi ed engagement Partner', formula: 'Piattaforma tecnologica dedicata', value: S_FONDAZIONE_TECH, unit: '€' },
        { code: 'S₄', label: 'Co-investimento Startup', formula: 'S₄,coord + S₄,tech', value: S4, unit: '€' },
        { code: 'P₄', label: 'Pool Abilitato', formula: 'C₄ + S₄', value: P4, unit: '€', highlight: true },
      ],
    },
    {
      id: 5, C: C5, S: S5, P: P5,
      formulas: [
        { code: 'C₅', label: 'Budget Media Impresa', formula: 'B_media', value: C5, unit: '€' },
        { code: 'S₅', label: 'Co-investimento Startup', formula: 'B_media × 2 (creatività, piattaforma, editoria, misurazione)', value: S5, unit: '€' },
        { code: 'P₅', label: 'Pool Abilitato', formula: 'C₅ + S₅ = 3 × B_media', value: P5, unit: '€', highlight: true },
      ],
    },
    {
      id: 6, C: C6, S: S6, P: P6,
      formulas: [
        { code: 'W', label: 'Lavoratori', formula: `N_imp × N_dip = ${s.nImp} × ${s.nDip}`, value: W, unit: 'n' },
        { code: 'C₆,hotel', label: 'Voucher Pernottamento', formula: 'W × 22% × 50 € = W × 11 €', value: C6hotel, unit: '€' },
        { code: 'C₆,food', label: 'Voucher Aperitivo/Cena', formula: 'W × 32% × 25 € = W × 8 €', value: C6food, unit: '€' },
        { code: 'C₆', label: 'Esborso Imprese', formula: 'C₆,hotel + C₆,food = W × 19 €  (Gruppo ILL 0 €, Gruppo EXE 0 € fissi)', value: C6, unit: '€' },
        { code: 'MG₆', label: 'Matching Grant Startup', formula: '1:1 solo Pernottamento: W × 22% × 50 € (25 € dip. + 25 € accomp.), zero seconde notti', value: MG6, unit: '€' },
        { code: 'S₆', label: 'Co-investimento Startup', formula: 'MG₆ + S_tech (90.000 €) — esclusa spesa privata', value: S6, unit: '€' },
        { code: 'V_priv', label: 'Spesa privata accompagnatore', formula: 'W × 11 € (stessa notte) + W × 8 € (cena) = W × 19 €', value: Vpriv, unit: '€' },
        { code: 'V_tur', label: 'Spesa turistica e culturale', formula: 'C₆ + V_priv + MG₆ = W × 49 €', value: Vtur, unit: '€' },
        { code: 'V_km0', label: 'Fatturato Filiera Km 0', formula: s.km0 ? 'W × 15% × 6 ordini × 30 € = W × 27 €' : 'Km 0 disattivato', value: Vkm0, unit: '€' },
        { code: 'CO₂', label: 'CO₂ evitata', formula: s.km0 ? '(W × 15% × 6) × (50 km × 0,29 kg/km) = W × 13,05 kg' : 'Km 0 disattivato', value: co2, unit: 'kg' },
        { code: 'P₆', label: 'Valore Diretto', formula: '(V_tur × 2,408) + V_km0 + S_tech', value: P6, unit: '€', highlight: true },
      ],
    },
  ];

  const impressions = Math.round((s.bMedia / 25000) * 10_000_000);
  return { profiles, unioniSplit, extra: { W, co2, bMS, bPID, nBen, impressions } };
}

export function simulate(s: SimState): SimResult {
  const { profiles, unioniSplit, extra } = computeProfiles(s);
  const n = 6;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    const pi = profiles[i];
    const ai = s.active[pi.id];
    for (let j = 0; j < n; j++) {
      const aj = s.active[profiles[j].id];
      if (!ai || !aj) continue;
      if (i === j) matrix[i][j] = pi.P;
      else matrix[i][j] = s.networkEffect ? ALPHA[i][j] * pi.P : 0;
    }
  }

  const partners: PartnerOutput[] = profiles.map((p, idx) => {
    const active = s.active[p.id];
    let inFlow = 0;
    let outFlow = 0;
    for (let k = 0; k < n; k++) {
      if (k === idx) continue;
      inFlow += matrix[k][idx];
      outFlow += matrix[idx][k];
    }
    const C = active ? p.C : 0;
    const S = active ? p.S : 0;
    const P = active ? p.P : 0;
    const vEsteso = P + inFlow;
    return {
      ...p,
      C, S, P,
      active,
      inFlow,
      outFlow,
      saldo: inFlow - outFlow,
      vEsteso,
      levaDiretta: safeDiv(P, C),
      levaEstesa: safeDiv(vEsteso, C),
    };
  });

  const cEco = partners.reduce((a, p) => a + p.C, 0);
  const pEco = partners.reduce((a, p) => a + p.P, 0);
  const spEco = partners.reduce((a, p) => a + p.inFlow, 0);
  const vRete = pEco + spEco;

  return {
    partners,
    matrix,
    cEco,
    pEco,
    spEco,
    vRete,
    lDiretta: safeDiv(pEco, cEco),
    lEco: safeDiv(vRete, cEco),
    unioniSplit,
    extra,
  };
}

/* ---------- Formatters ---------- */
export const fmt = (n: number) =>
  new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 }).format(Math.round(n || 0));
export const fmtDec = (n: number, d = 1) =>
  new Intl.NumberFormat('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n || 0);
export const fmtEur = (n: number) => `${fmt(n)} €`;
export const fmtCompact = (n: number) => {
  const v = n || 0;
  if (Math.abs(v) >= 1_000_000) return `${fmtDec(v / 1_000_000, 2)} M€`;
  if (Math.abs(v) >= 1_000) return `${fmt(v / 1_000)} k€`;
  return `${fmt(v)} €`;
};
export const fmtX = (n: number) => `${fmtDec(n || 0, 1)}×`;
