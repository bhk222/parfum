import { FormulaVersion } from '../models/types';

export function computeTotals(version: FormulaVersion) {
  const total = version.items.reduce((a, i) => a + i.percent, 0);
  return { total };
}

export function splitVolatility(version: FormulaVersion, resolver: (id: string) => 'top'|'heart'|'base'|undefined) {
  let top = 0, heart = 0, base = 0;
  version.items.forEach(i => {
    const level = resolver(i.ingredientId);
    if (level === 'top') top += i.percent;
    else if (level === 'heart') heart += i.percent;
    else if (level === 'base') base += i.percent;
  });
  const sum = top + heart + base || 1;
  return {
    topPct: top / sum * 100,
    heartPct: heart / sum * 100,
    basePct: base / sum * 100
  };
}

export function diffVersions(a: FormulaVersion, b: FormulaVersion) {
  const mapA = new Map(a.items.map(i => [i.ingredientId, i.percent]));
  const mapB = new Map(b.items.map(i => [i.ingredientId, i.percent]));
  const all = new Set([...mapA.keys(), ...mapB.keys()]);
  return [...all].map(id => {
    const pa = mapA.get(id) ?? 0;
    const pb = mapB.get(id) ?? 0;
    const delta = pb - pa;
    const rel = pa !== 0 ? (delta / pa) * 100 : (pb ? 100 : 0);
    return { ingredientId: id, from: pa, to: pb, delta, rel };
  });
}