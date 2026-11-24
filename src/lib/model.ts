/**
 * Modello matematico del Simulatore Matriciale 6x6 — Shared Value Esteso.
 * Tutte le formule sono esposte in interfaccia (requisito anti-black-box).
 */

export const TOR_VERGATA = 2.408; // moltiplicatore macroeconomico Università Tor Vergata / Ministero del Turismo
export const S_TECH = 90_000; // infrastruttura digitale, piattaforma welfare, piattaforme e strumenti MarTech, Web Space CSRD/WICI
export const PMI_UNIT_COST = 1_100; // costo digitalizzazione MarTech per micro-impresa (Profilo 1, 1/10 del benchmark PID)
export const MARCHESTORIE_PER_COMUNE = 10_000;
export const PID_PUBLIC_PER_PMI = 11_000;

export type PartnerId = 1 | 2 | 3 | 4 | 5 | 6;

export interface SimState {
  // Profilo 1 — Unioni di Comuni (Monti Azzurri)
  nSpett1: number;
  cUnione: number;
  nPmi1: number;
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
  nUnioni: 4,
  nCom: 8,
  nPmi2: 5,
  nAdd: 2500,
  vNom: 75,
  tRed: 20,
  nSpett4: 8,
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
  { id: 1, short: 'Unioni', name: 'Unioni di Comuni', sub: 'Pilota: Unione dei Monti Azzurri', track: 1, role: 'Luoghi, palcoscenici, ospitalità' },
  { id: 2, short: 'Regione', name: 'Regione Marche', sub: 'Co-promotore dello sviluppo in 4 Province', track: 2, role: 'Legittimazione e cornice territoriale' },
  { id: 3, short: 'Az. Pubbliche', name: 'Aziende Pubbliche', sub: 'Università, Aziende Sanitarie', track: 1, role: 'Solo Voucher Welfare ai propri addetti' },
  { id: 4, short: 'Fondazione', name: 'Fondazione Bancaria', sub: 'Pay per Outcome certificato', track: 1, role: 'Produzione culturale e Matching Grant' },
  { id: 5, short: 'CSR Media', name: 'Imprese CSR', sub: 'Branding istituzionale — Budget Media', track: 2, role: 'Traffico qualificato e posizionamento' },
  { id: 6, short: 'Shared Value', name: 'Imprese Shared Value', sub: 'Co-promotori (Gruppo ILL), (Gruppo EXE), Rete PMI CSR', track: 1, role: 'Motore netto di domanda e infrastruttura' },
];

/** Coefficienti di assorbimento α(i→j) — indici di fruibilità di beni non rivali */
export const ALPHA: number[][] = [
  [0, 0.4, 0.25, 0.3, 0.2, 0.3],
  [0.25, 0, 0.1, 0.15, 0.15, 0.15],
  [0.6, 0.5, 0, 0.2, 0.15, 0.15],
  [0.5, 0.45, 0.25, 0, 0.25, 0.3],
  [0.7, 0.75, 0.2, 0.45, 0, 0.4],
  [0.65, 0.7, 0.35, 0.3, 0.3, 0],
];

export interface FormulaRow {
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

export function computeProfiles(s: SimState): { profiles: ProfileResult[]; extra: SimResult['extra'] } {
  // Profilo 1
  const C1 = s.nSpett1 * s.cUnione;
  const S1 = s.nPmi1 * PMI_UNIT_COST;
  const P1 = C1 + S1;

  // Profilo 2
  const bMS = s.nUnioni * s.nCom * MARCHESTORIE_PER_COMUNE;
  const bPID = s.nUnioni * s.nPmi2 * PID_PUBLIC_PER_PMI;
  const P2 = bMS + bPID;
  const C2 = P2 / 10;
  const S2 = P2 - C2;

  // Profilo 3
  const nBen = s.nAdd * (s.tRed / 100);
  const C3 = nBen * s.vNom;
  const S3 = C3;
  const P3 = (C3 + S3) * TOR_VERGATA;

  // Profilo 4
  const C4 = s.nSpett4 * s.cOut;
  const S4 = C4 * 1.5;
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

  const profiles: ProfileResult[] = [
    {
      id: 1, C: C1, S: S1, P: P1,
      formulas: [
        { label: 'Esborso Unione (C₁)', formula: `N_spett × C_unione = ${s.nSpett1} × ${fmt(s.cUnione)}`, value: C1, unit: '€' },
        { label: 'Co-investimento Startup (S₁)', formula: `N_pmi × 1.100 € = ${s.nPmi1} × 1.100`, value: S1, unit: '€' },
        { label: 'Pool Abilitato (P₁)', formula: 'C₁ + S₁', value: P1, unit: '€', highlight: true },
      ],
    },
    {
      id: 2, C: C2, S: S2, P: P2,
      formulas: [
        { label: 'Benchmark MarcheStorie (B_MS)', formula: `N_unioni × N_com × 10.000 € = ${s.nUnioni} × ${s.nCom} × 10.000`, value: bMS, unit: '€' },
        { label: 'Benchmark PID (B_PID)', formula: `N_unioni × N_pmi × 11.000 € = ${s.nUnioni} × ${s.nPmi2} × 11.000`, value: bPID, unit: '€' },
        { label: 'Costo per Outcome Regione (C₂)', formula: '(B_MS + B_PID) / 10', value: C2, unit: '€' },
        { label: 'Risparmio pubblico abilitato (S₂)', formula: '(B_MS + B_PID) − C₂', value: S2, unit: '€' },
        { label: 'Pool Abilitato (P₂)', formula: 'B_MS + B_PID', value: P2, unit: '€', highlight: true },
      ],
    },
    {
      id: 3, C: C3, S: S3, P: P3,
      formulas: [
        { label: 'Beneficiari effettivi (N_ben)', formula: `N_add × T_red = ${fmt(s.nAdd)} × ${s.tRed}%`, value: nBen, unit: 'n' },
        { label: 'Voucher Welfare redenti (C₃)', formula: `N_ben × V_nom = ${fmt(nBen)} × ${s.vNom} €  (≈ ${fmtDec(safeDiv(C3, s.nAdd))} €/addetto)`, value: C3, unit: '€' },
        { label: 'Matching Grant 100% Startup (S₃)', formula: 'S₃ = C₃', value: S3, unit: '€' },
        { label: 'Pool Abilitato (P₃)', formula: '(C₃ + S₃) × 2,408 (Tor Vergata)', value: P3, unit: '€', highlight: true },
      ],
    },
    {
      id: 4, C: C4, S: S4, P: P4,
      formulas: [
        { label: 'Pay per Outcome (C₄)', formula: `N_spett × C_out = ${s.nSpett4} × ${fmt(s.cOut)}`, value: C4, unit: '€' },
        { label: 'Co-investimento Startup (S₄)', formula: 'C₄ × 1,5', value: S4, unit: '€' },
        { label: 'Pool Abilitato (P₄)', formula: 'C₄ + S₄', value: P4, unit: '€', highlight: true },
      ],
    },
    {
      id: 5, C: C5, S: S5, P: P5,
      formulas: [
        { label: 'Budget Media Impresa (C₅)', formula: 'B_media', value: C5, unit: '€' },
        { label: 'Co-investimento Startup (S₅)', formula: 'B_media × 2 (creatività, piattaforma, editoria, misurazione)', value: S5, unit: '€' },
        { label: 'Pool Abilitato (P₅)', formula: 'C₅ + S₅ = 3 × B_media', value: P5, unit: '€', highlight: true },
      ],
    },
    {
      id: 6, C: C6, S: S6, P: P6,
      formulas: [
        { label: 'Lavoratori (W)', formula: `N_imp × N_dip = ${s.nImp} × ${s.nDip}`, value: W, unit: 'n' },
        { label: 'Voucher Pernottamento (C₆,hotel)', formula: 'W × 22% × 50 € = W × 11 €', value: C6hotel, unit: '€' },
        { label: 'Voucher Aperitivo/Cena (C₆,food)', formula: 'W × 32% × 25 € = W × 8 €', value: C6food, unit: '€' },
        { label: 'Esborso Imprese (C₆)', formula: 'C₆,hotel + C₆,food = W × 19 €  (Gruppo ILL 0 €, Gruppo EXE 0 € fissi)', value: C6, unit: '€' },
        { label: 'Matching Grant Startup (MG₆)', formula: '1:1 solo Pernottamento: W × 22% × 50 € (25 € dip. + 25 € accomp.), zero seconde notti', value: MG6, unit: '€' },
        { label: 'Co-investimento Startup (S₆)', formula: 'MG₆ + S_tech (90.000 €) — esclusa spesa privata', value: S6, unit: '€' },
        { label: 'Spesa privata accompagnatore (V_priv)', formula: 'W × 11 € (stessa notte) + W × 8 € (cena) = W × 19 €', value: Vpriv, unit: '€' },
        { label: 'Spesa turistica e culturale (V_tur)', formula: 'C₆ + V_priv + MG₆ = W × 49 €', value: Vtur, unit: '€' },
        { label: 'Fatturato Filiera Km 0 (V_km0)', formula: s.km0 ? 'W × 15% × 6 ordini × 30 € = W × 27 €' : 'Km 0 disattivato', value: Vkm0, unit: '€' },
        { label: 'CO₂ evitata', formula: s.km0 ? '(W × 15% × 6) × (50 km × 0,29 kg/km) = W × 13,05 kg' : 'Km 0 disattivato', value: co2, unit: 'kg' },
        { label: 'Valore Diretto (P₆)', formula: '(V_tur × 2,408) + V_km0 + S_tech', value: P6, unit: '€', highlight: true },
      ],
    },
  ];

  const impressions = Math.round((s.bMedia / 25000) * 10_000_000);
  return { profiles, extra: { W, co2, bMS, bPID, nBen, impressions } };
}

export function simulate(s: SimState): SimResult {
  const { profiles, extra } = computeProfiles(s);
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
