import { ALPHA, PARTNERS, fmtCompact, fmtEur, type SimResult } from '../../lib/model';
import { cn } from '../../utils/cn';
import type { Focus } from './Sankey';

export default function Matrix({
  result,
  focus,
  setFocus,
  selected,
  setSelected,
}: {
  result: SimResult;
  focus: Focus;
  setFocus: (f: Focus) => void;
  selected: { i: number; j: number } | null;
  setSelected: (s: { i: number; j: number } | null) => void;
}) {
  const { matrix, partners } = result;
  const maxOff = Math.max(1, ...matrix.flatMap((r, i) => r.filter((_, j) => j !== i)));

  const cellBg = (i: number, j: number) => {
    if (i === j) return 'rgba(233,230,223,0.10)';
    const v = matrix[i][j];
    const t = Math.sqrt(v / maxOff);
    return `rgba(95,134,179,${(0.08 + t * 0.55).toFixed(3)})`;
  };

  const isHi = (i: number, j: number) => {
    if (selected && selected.i === i && selected.j === j) return true;
    if (!focus) return false;
    if (focus.type === 'out') return focus.i === i;
    if (focus.type === 'in') return focus.j === j;
    if (focus.type === 'cell') return focus.i === i && focus.j === j;
    return false;
  };

  return (
    <div>
      <div className="overflow-x-auto thin-scroll rounded-2xl border border-cream/10">
        <table className="w-full min-w-[820px] border-collapse text-[12px] tabular">
          <caption className="sr-only">Matrice di spillover M 6x6: righe emittenti, colonne beneficiari</caption>
          <thead>
            <tr className="text-cream/50">
              <th scope="col" className="sticky left-0 z-10 bg-ink px-3 py-3 text-left font-normal">
                <span className="eyebrow">Emittente ↓ / Beneficiario →</span>
              </th>
              {PARTNERS.map((p, j) => (
                <th
                  key={p.id}
                  scope="col"
                  className={cn('px-2 py-3 text-center font-medium cursor-pointer transition-colors', partners[j].active ? 'text-cream/80 hover:text-azzurro-2' : 'text-cream/25 line-through')}
                  onMouseEnter={() => partners[j].active && setFocus({ type: 'in', j })}
                  onMouseLeave={() => setFocus(null)}
                  onClick={() => partners[j].active && setFocus({ type: 'in', j })}
                >
                  <div className="font-mono text-[10px] opacity-60">{p.id}</div>
                  {p.short}
                </th>
              ))}
              <th scope="col" className="px-3 py-3 text-right font-medium text-azzurro-2">Out-Flow</th>
            </tr>
          </thead>
          <tbody>
            {PARTNERS.map((p, i) => (
              <tr key={p.id} className={cn(!partners[i].active && 'opacity-35')}>
                <th
                  scope="row"
                  className={cn('sticky left-0 z-10 bg-ink px-3 py-2 text-left font-medium cursor-pointer transition-colors', partners[i].active ? 'text-cream/85 hover:text-azzurro-2' : 'text-cream/30 line-through')}
                  onMouseEnter={() => partners[i].active && setFocus({ type: 'out', i })}
                  onMouseLeave={() => setFocus(null)}
                  onClick={() => partners[i].active && setFocus({ type: 'out', i })}
                >
                  <span className="font-mono text-[10px] opacity-60 mr-2">{p.id}</span>{p.short}
                </th>
                {PARTNERS.map((_, j) => {
                  const v = matrix[i][j];
                  const hi = isHi(i, j);
                  return (
                    <td key={j} className="p-[3px]">
                      <button
                        type="button"
                        disabled={!partners[i].active || !partners[j].active}
                        onClick={() => { setSelected({ i, j }); setFocus({ type: 'cell', i, j }); }}
                        onMouseEnter={() => setFocus({ type: 'cell', i, j })}
                        onMouseLeave={() => setFocus(selected ? { type: 'cell', i: selected.i, j: selected.j } : null)}
                        className={cn(
                          'group relative flex h-14 w-full flex-col items-center justify-center rounded-md border transition-all duration-300 disabled:cursor-not-allowed',
                          hi ? 'border-azzurro-2 scale-[1.03] shadow-[0_0_0_1px_rgba(143,176,214,.6)]' : 'border-transparent hover:border-cream/30',
                          i === j && 'border-dashed border-cream/25',
                        )}
                        style={{ background: cellBg(i, j) }}
                        aria-label={`${PARTNERS[i].short} verso ${PARTNERS[j].short}: ${fmtEur(v)}`}
                      >
                        <span className={cn('font-medium', i === j ? 'text-cream' : 'text-cream/90')}>{fmtCompact(v)}</span>
                        <span className="font-mono text-[9px] text-cream/50">{i === j ? 'diretto' : `α ${ALPHA[i][j].toFixed(2)}`}</span>
                      </button>
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-right font-medium text-azzurro-2">{fmtCompact(partners[i].outFlow)}</td>
              </tr>
            ))}
            <tr className="border-t border-cream/15">
              <th scope="row" className="sticky left-0 z-10 bg-ink px-3 py-3 text-left font-medium text-azzurro-2">In-Flow</th>
              {partners.map((p) => (
                <td key={p.id} className="px-2 py-3 text-center font-medium text-azzurro-2">{fmtCompact(p.inFlow)}</td>
              ))}
              <td className="px-3 py-3 text-right font-semibold text-cream">{fmtCompact(result.spEco)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Dettaglio cella */}
      <div className="mt-4 min-h-[64px] rounded-xl border border-cream/10 bg-ink-2/60 px-4 py-3 font-mono text-[12px] text-cream/80">
        {selected ? (
          selected.i === selected.j ? (
            <>
              <span className="text-cream/50">M[{selected.i + 1}][{selected.j + 1}] (diagonale) = </span>
              P{selected.i + 1} = <span className="text-cream">{fmtEur(partners[selected.i].P)}</span>
              <span className="text-cream/50"> — Valore Diretto di {PARTNERS[selected.i].name}</span>
            </>
          ) : (
            <>
              <span className="text-cream/50">M[{selected.i + 1}][{selected.j + 1}] = </span>
              α<sub>{selected.i + 1}→{selected.j + 1}</sub> × P{selected.i + 1} = {ALPHA[selected.i][selected.j].toFixed(2)} × {fmtEur(partners[selected.i].P)} ={' '}
              <span className="text-azzurro-2">{fmtEur(matrix[selected.i][selected.j])}</span>
              <span className="text-cream/50"> — valore equivalente trasferito da {PARTNERS[selected.i].short} a {PARTNERS[selected.j].short} (bene non rivale)</span>
            </>
          )
        ) : (
          <span className="text-cream/45">Seleziona una cella (i, j) per evidenziare il flusso nel Sankey e leggere la formula α<sub>i→j</sub> × Pᵢ.</span>
        )}
      </div>
    </div>
  );
}
