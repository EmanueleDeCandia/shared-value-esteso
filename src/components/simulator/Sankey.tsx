import { useMemo, useState } from 'react';
import { sankey, sankeyJustify, sankeyLinkHorizontal, type SankeyNode, type SankeyLink } from 'd3-sankey';
import { PARTNERS, fmtEur, fmtCompact, type SimResult, ALPHA } from '../../lib/model';
import { cn } from '../../utils/cn';

export type Focus =
  | { type: 'in'; j: number }
  | { type: 'out'; i: number }
  | { type: 'cell'; i: number; j: number }
  | null;

interface NodeExtra { id: string; kind: 'L' | 'HUB' | 'IND' | 'P' | 'R'; idx: number; label: string; sub?: string }
interface LinkExtra { kind: 'C' | 'S' | 'IND' | 'D' | 'SP'; i: number; j: number }

type N = SankeyNode<NodeExtra, LinkExtra>;
type L = SankeyLink<NodeExtra, LinkExtra>;

const POOL_ORDER = [0, 2, 3, 5, 1, 4]; // Binario 1: 1,3,4,6 — Binario 2: 2,5

/** Adjusts vertical label centers so adjacent multi-line labels never overlap. */
function resolveLabelY(nodes: N[], minGap: number, minY: number, maxY: number): Map<string, number> {
  const sorted = [...nodes].sort((a, b) => ((a.y0 ?? 0) + (a.y1 ?? 0)) / 2 - ((b.y0 ?? 0) + (b.y1 ?? 0)) / 2);
  const ys = sorted.map((n) => ((n.y0 ?? 0) + (n.y1 ?? 0)) / 2);
  for (let i = 0; i < ys.length; i++) {
    const floor = i === 0 ? minY : ys[i - 1] + minGap;
    if (ys[i] < floor) ys[i] = floor;
  }
  for (let i = ys.length - 1; i >= 0; i--) {
    const ceil = i === ys.length - 1 ? maxY : ys[i + 1] - minGap;
    if (ys[i] > ceil) ys[i] = ceil;
  }
  const map = new Map<string, number>();
  sorted.forEach((n, i) => map.set(n.id, ys[i]));
  return map;
}

export default function Sankey({
  result,
  focus,
  setFocus,
  networkEffect,
}: {
  result: SimResult;
  focus: Focus;
  setFocus: (f: Focus) => void;
  networkEffect: boolean;
}) {
  const W = 1180;
  const H = 740;
  const PAD_X = 156;

  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  const graph = useMemo(() => {
    type LinkIn = LinkExtra & { source: string; target: string; value: number };
    const nodes: NodeExtra[] = [];
    const links: LinkIn[] = [];

    const activeIdx = result.partners.map((p, i) => (p.active && p.P > 0 ? i : -1)).filter((i) => i >= 0);

    activeIdx.forEach((i) => nodes.push({ id: `L${i}`, kind: 'L', idx: i, label: PARTNERS[i].name, sub: `C${i + 1}` }));
    const split = activeIdx.map((i) => {
      const p = result.partners[i];
      const cLink = Math.min(p.C, p.P);
      const sLink = Math.min(p.S, Math.max(0, p.P - cLink));
      const indLink = Math.max(0, p.P - cLink - sLink);
      return { i, cLink, sLink, indLink };
    });
    const hubValue = split.reduce((a, x) => a + x.sLink, 0);
    const indValue = split.reduce((a, x) => a + x.indLink, 0);
    if (hubValue > 0) nodes.push({ id: 'HUB', kind: 'HUB', idx: -1, label: 'Hub Startup', sub: 'Co-investimento Sᵢ' });
    if (indValue > 0) nodes.push({ id: 'IND', kind: 'IND', idx: -1, label: 'Indotto Turismo + Risparmio Pubblico', sub: '2,408× + R_pub' });
    POOL_ORDER.filter((i) => activeIdx.includes(i)).forEach((i) => nodes.push({ id: `P${i}`, kind: 'P', idx: i, label: `Pool P${i + 1}`, sub: PARTNERS[i].short }));
    activeIdx.forEach((j) => nodes.push({ id: `R${j}`, kind: 'R', idx: j, label: PARTNERS[j].name, sub: `V esteso ${j + 1}` }));

    split.forEach(({ i, cLink, sLink, indLink }) => {
      if (cLink > 0) links.push({ source: `L${i}`, target: `P${i}`, value: cLink, kind: 'C', i, j: i });
      if (sLink > 0) links.push({ source: 'HUB', target: `P${i}`, value: sLink, kind: 'S', i, j: i });
      if (indLink > 0) links.push({ source: 'IND', target: `P${i}`, value: indLink, kind: 'IND', i, j: i });
      activeIdx.forEach((j) => {
        const v = result.matrix[i][j];
        if (v > 0) links.push({ source: `P${i}`, target: `R${j}`, value: v, kind: i === j ? 'D' : 'SP', i, j });
      });
    });

    if (nodes.length === 0 || links.length === 0) return null;

    const gen = sankey<NodeExtra, LinkExtra>()
      .nodeId((d) => d.id)
      .nodeWidth(16)
      .nodePadding(24)
      .nodeAlign(sankeyJustify)
      .nodeSort(null as never)
      .linkSort(null as never)
      .extent([[PAD_X, 38], [W - PAD_X, H - 28]]);

    try {
      return gen({ nodes: nodes.map((n) => ({ ...n })), links: links.map((l) => ({ ...l })) });
    } catch {
      return null;
    }
  }, [result]);

  const labelYMap = useMemo(() => {
    if (!graph) return new Map<string, number>();
    const all = graph.nodes as N[];
    const left = resolveLabelY(
      all.filter((n) => n.kind === 'L' || n.kind === 'HUB' || n.kind === 'IND'),
      32,
      38,
      H - 34,
    );
    const right = resolveLabelY(
      all.filter((n) => n.kind === 'R'),
      32,
      38,
      H - 34,
    );
    return new Map([...left, ...right]);
  }, [graph]);

  const path = sankeyLinkHorizontal<NodeExtra, LinkExtra>();

  const linkActive = (l: L): boolean | null => {
    if (!focus) return null;
    const src = l.source as N;
    if (focus.type === 'out') return l.i === focus.i;
    if (focus.type === 'in') return src.kind === 'P' && l.j === focus.j;
    if (focus.type === 'cell') return src.kind === 'P' && l.i === focus.i && l.j === focus.j;
    return null;
  };

  const linkColor = (l: L) => {
    switch (l.kind) {
      case 'C': return '#e9e6df';
      case 'S': return '#9a9892';
      case 'IND': return '#6c7c8e';
      case 'D': return '#e9e6df';
      default: return '#6f98c7';
    }
  };

  const describe = (l: L) => {
    const i = l.i, j = l.j;
    const pi = result.partners[i];
    if (l.kind === 'C') return `C${i + 1} — Esborso ${PARTNERS[i].name}: ${fmtEur(pi.C)}`;
    if (l.kind === 'S') return `Hub Startup → Pool P${i + 1}: co-investimento Startup S${i + 1} = ${fmtEur(l.value)}`;
    if (l.kind === 'IND') return `Indotto Turismo (2,408×) + Risparmio Pubblico → Pool P${i + 1}: ${fmtEur(l.value)}`;
    if (l.kind === 'D') return `Valore diretto P${i + 1} → ${PARTNERS[i].name}: ${fmtEur(pi.P)}`;
    return `Spillover ${PARTNERS[i].short} → ${PARTNERS[j].short}: α ${ALPHA[i][j].toFixed(2)} × P${i + 1} ${fmtEur(pi.P)} = ${fmtEur(result.matrix[i][j])}`;
  };

  if (!graph) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-cream/10 text-sm text-cream/50">
        Attiva almeno un Partner per visualizzare i flussi.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto thin-scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="min-w-[860px] w-full h-auto select-none"
          role="img"
          aria-label="Diagramma Sankey a tre stadi: esborsi dei Partner, Hub Startup con Pool Abilitati, Partner beneficiari con valore esteso"
          onMouseLeave={() => { setTip(null); }}
        >
          <defs>
            <linearGradient id="sp" x1="0" x2="1">
              <stop offset="0%" stopColor="#8fb0d6" />
              <stop offset="100%" stopColor="#5f86b3" />
            </linearGradient>
          </defs>

          {/* Stage labels */}
          {[
            { x: PAD_X + 8, t: 'STADIO 1 · ESBORSO Cᵢ', anchor: 'start' },
            { x: W / 2, t: 'STADIO 2 · HUB STARTUP → POOL Pᵢ', anchor: 'middle' },
            { x: W - PAD_X - 8, t: 'STADIO 3 · VALORE ESTESO FRUITO', anchor: 'end' },
          ].map((s) => (
            <text key={s.t} x={s.x} y={14} textAnchor={s.anchor as never} fontSize="11" letterSpacing="2" fill="#e9e6df" fillOpacity="0.45">{s.t}</text>
          ))}

          {/* Links */}
          <g fill="none">
            {graph.links.map((l, k) => {
              const act = linkActive(l as L);
              const base = l.kind === 'SP' ? 0.45 : l.kind === 'S' ? 0.25 : 0.55;
              const op = act === null ? base : act ? 0.95 : 0.05;
              return (
                <path
                  key={k}
                  d={path(l as never) || ''}
                  stroke={l.kind === 'SP' ? 'url(#sp)' : linkColor(l as L)}
                  strokeOpacity={op}
                  strokeWidth={Math.max(1.2, l.width || 0)}
                  className="transition-all duration-500"
                  style={{ mixBlendMode: 'screen' }}
                  onMouseMove={(e) => {
                    const r = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, text: describe(l as L) });
                  }}
                  onMouseLeave={() => setTip(null)}
                >
                  <title>{describe(l as L)}</title>
                </path>
              );
            })}
          </g>

          {/* Nodes */}
          {graph.nodes.map((n) => {
            const node = n as N;
            const x0 = node.x0 ?? 0, x1 = node.x1 ?? 0, y0 = node.y0 ?? 0, y1 = node.y1 ?? 0;
            const h = Math.max(2, y1 - y0);
            const isLeft = node.kind === 'L' || node.kind === 'HUB' || node.kind === 'IND';
            const isRight = node.kind === 'R';
            const p = node.idx >= 0 ? result.partners[node.idx] : null;
            const focused =
              (focus?.type === 'out' && (node.kind === 'L' || node.kind === 'P') && node.idx === focus.i) ||
              (focus?.type === 'in' && node.kind === 'R' && node.idx === focus.j) ||
              (focus?.type === 'cell' && ((node.kind === 'P' && node.idx === focus.i) || (node.kind === 'R' && node.idx === focus.j)));
            const fill = node.kind === 'HUB' ? '#8fb0d6' : node.kind === 'IND' ? '#6c7c8e' : node.kind === 'P' ? '#e9e6df' : node.kind === 'R' ? '#8fb0d6' : '#e9e6df';
            const valueText =
              node.kind === 'L' ? fmtCompact(p!.C)
              : node.kind === 'HUB' || node.kind === 'IND' ? fmtCompact(node.value || 0)
              : node.kind === 'P' ? fmtCompact(p!.P)
              : fmtCompact(p!.vEsteso);
            const interactive = node.kind === 'L' || node.kind === 'R' || node.kind === 'P';
            const cy = y0 + h / 2;
            const labelY = node.kind === 'P' ? cy : (labelYMap.get(node.id) ?? cy);
            const hasOffset = node.kind !== 'P' && Math.abs(labelY - cy) > 4;
            return (
              <g
                key={node.id}
                className={cn(interactive && 'cursor-pointer')}
                tabIndex={interactive ? 0 : -1}
                role={interactive ? 'button' : undefined}
                aria-label={`${node.label} ${valueText}`}
                onMouseEnter={() => {
                  if (node.kind === 'R') setFocus({ type: 'in', j: node.idx });
                  else if (node.kind === 'L' || node.kind === 'P') setFocus({ type: 'out', i: node.idx });
                }}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => {
                  if (node.kind === 'R') setFocus({ type: 'in', j: node.idx });
                  else if (node.kind === 'L' || node.kind === 'P') setFocus({ type: 'out', i: node.idx });
                }}
                onBlur={() => setFocus(null)}
                onClick={() => {
                  if (node.kind === 'R') setFocus({ type: 'in', j: node.idx });
                  else if (node.kind === 'L' || node.kind === 'P') setFocus({ type: 'out', i: node.idx });
                }}
              >
                <rect x={x0} y={y0} width={x1 - x0} height={h} rx={3} fill={fill} fillOpacity={focused ? 1 : 0.85} stroke={focused ? '#fff' : 'none'} className="transition-all duration-300" />
                {hasOffset && (
                  <line
                    x1={isLeft ? x0 - 2 : x1 + 2}
                    y1={cy}
                    x2={isLeft ? x0 - 8 : x1 + 8}
                    y2={labelY}
                    stroke="#e9e6df"
                    strokeOpacity={focus && !focused ? 0.15 : 0.3}
                    strokeWidth={1}
                  />
                )}
                {/* label */}
                <text
                  x={isLeft ? x0 - 10 : isRight ? x1 + 10 : (x0 + x1) / 2}
                  y={node.kind === 'IND' ? labelY - 10 : labelY - (node.kind === 'P' ? 4 : 2)}
                  textAnchor={isLeft ? 'end' : isRight ? 'start' : 'middle'}
                  fontSize={node.kind === 'P' ? 10 : 12}
                  fontWeight={600}
                  fill="#e9e6df"
                  fillOpacity={focus && !focused ? 0.35 : 0.95}
                  className="transition-all duration-300"
                  dy={node.kind === 'P' ? -h / 2 - 6 : 0}
                >
                  {node.kind === 'P' ? (
                    `P${node.idx + 1}`
                  ) : node.kind === 'IND' ? (
                    <>
                      <tspan x={x0 - 10}>Indotto Turismo</tspan>
                      <tspan x={x0 - 10} dy={14}>+ Risparmio Pubblico</tspan>
                    </>
                  ) : (
                    node.label
                  )}
                </text>
                {node.kind !== 'P' && (
                  <text
                    x={isLeft ? x0 - 10 : x1 + 10}
                    y={node.kind === 'IND' ? labelY + 18 : labelY + 12}
                    textAnchor={isLeft ? 'end' : 'start'}
                    fontSize={11}
                    fill={node.kind === 'R' ? '#8fb0d6' : '#e9e6df'}
                    fillOpacity={focus && !focused ? 0.35 : 0.75}
                    fontFamily="JetBrains Mono, monospace"
                    className="transition-all duration-300"
                  >
                    {node.kind === 'HUB' || node.kind === 'IND' ? `+ ${valueText}` : valueText}
                  </text>
                )}
              </g>
            );
          })}

          {/* Binario legend near pools */}
          <g fontSize="10" letterSpacing="1.5" fill="#e9e6df" fillOpacity="0.4">
            <text x={W / 2} y={H - 6} textAnchor="middle">POOL ORDINATI: BINARIO 1 (P1·P3·P4·P6) · BINARIO 2 (P2·P5)</text>
          </g>
        </svg>
      </div>

      {tip && (
        <div
          className="pointer-events-none absolute z-10 max-w-xs rounded-lg glass-dark px-3 py-2 text-[12px] leading-snug text-cream shadow-xl"
          style={{ left: Math.min(tip.x + 14, 800), top: tip.y + 14 }}
        >
          {tip.text}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-cream/60">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded bg-cream/70" /> Esborso Cᵢ / Valore diretto Pᵢ</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded bg-[#9a9892]/60" /> Co-investimento Startup Sᵢ</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded bg-[#6c7c8e]/70" /> Indotto Turismo + Risparmio Pubblico</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded bg-gradient-to-r from-azzurro-2 to-azzurro" /> Spillover α × Pᵢ {!networkEffect && '(disattivati)'}</span>
        <span className="ml-auto hidden sm:inline">Hover a sinistra → Out-Flow · Hover a destra → In-Flow</span>
      </div>
    </div>
  );
}
