import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFormulaStore } from '../../stores/formulaStore';
import { useInventoryStore } from '../../stores/inventoryStore';
import { diffVersions, splitVolatility } from '../../utils/stats';
import SafetyAlerts from '../../components/safety/SafetyAlerts';
import SuggestionsPanel from '../../components/suggestions/SuggestionsPanel';
import Tooltip from '../../components/tips/Tooltip';
import { VolatilityChart } from '../../components/charts/VolatilityChart';
import { PreviewParfum } from '../../components/PreviewParfum';

export function FormulaDetailPage() {
  const { id } = useParams();
  const { loadFormulas, loadVersions, versions, formulas } = useFormulaStore();
  const { ingredients, load: loadInv } = useInventoryStore();
  const [selectedVersionIdx, setSelectedVersionIdx] = useState<number>(-1);

  useEffect(() => { loadFormulas(); loadInv(); }, [loadFormulas, loadInv]);
  useEffect(() => { if (id) loadVersions(id); }, [id, loadVersions]);

  const formula = formulas.find(f => f.id === id);
  const vs = id ? versions[id] ?? [] : [];
  useEffect(() => { if (vs.length) setSelectedVersionIdx(vs.length - 1); }, [vs.length]);

  const current = vs[selectedVersionIdx];
  const previous = selectedVersionIdx > 0 ? vs[selectedVersionIdx - 1] : undefined;

  const resolver = (ingId: string) => ingredients.find(i => i.id === ingId)?.noteLevel;
  const volatility = current ? splitVolatility(current, resolver as any) : null;
  const diffs = previous && current ? diffVersions(previous, current) : [];

  // Évaluation IA simplifiée
  function evaluateFormula(version: any) {
    if (!version || !ingredients.length) return null;
    let longivite = 0, qualite = 0, senteur = '';
    let top = 0, heart = 0, base = 0;
    version.items.forEach((it: any) => {
      const ing = ingredients.find(i => i.id === it.ingredientId);
      if (!ing) return;
      if (ing.noteLevel === 'top') top += it.percent;
      if (ing.noteLevel === 'heart') heart += it.percent;
      if (ing.noteLevel === 'base') base += it.percent;
      if (['Romarin','Menthe poivrée','Eucalyptus','Zeste de citron'].includes(ing.name)) senteur += 'Frais, ';
      if (['Cyprès','Oliban'].includes(ing.name)) senteur += 'Boisé, ';
      if (['Ylang-ylang'].includes(ing.name)) senteur += 'Floral, ';
    });
    longivite = Math.round(base * 0.8 + heart * 0.2);
    qualite = Math.round((top + heart + base) / version.items.length);
    senteur = senteur.replace(/, $/, '');
    return { longivite, qualite, senteur };
  }
  const iaEval = evaluateFormula(current);

  // Détection de problèmes et solutions IA
  function getIASolutions(version: any) {
    if (!version || !ingredients.length) return [];
    const solutions: string[] = [];
    let top = 0, heart = 0, base = 0;
    let allergene = false;
    version.items.forEach((it: any) => {
      const ing = ingredients.find(i => i.id === it.ingredientId);
      if (!ing) return;
      if (ing.noteLevel === 'top') top += it.percent;
      if (ing.noteLevel === 'heart') heart += it.percent;
      if (ing.noteLevel === 'base') base += it.percent;
      // Correction : allergènes sur Material
      if ((ing as any).allergens && Object.keys((ing as any).allergens).length) allergene = true;
    });
    if (top < 10) solutions.push('La formule manque de notes de tête : ajoutez un agrume ou une note fraîche.');
    if (base < 10) solutions.push('La longévité sera faible : ajoutez une note de fond comme Oliban ou une résine.');
    if (heart < 10) solutions.push('La formule manque de notes de cœur : ajoutez une fleur ou une épice.');
    if (allergene) solutions.push('Attention : présence d’allergènes. Vérifiez la sécurité avant utilisation.');
    if (top + heart + base < 100) solutions.push('Le total des pourcentages est inférieur à 100 % : ajustez les quantités.');
    if (!solutions.length) solutions.push('Formule équilibrée et professionnelle.');
    return solutions;
  }
  const iaSolutions = getIASolutions(current);

  return (
    <div>
      <h1>
        <Tooltip code="formula_title" text="Nom de la formule. Crée des versions pour suivre les changements.">
          <span>Formule: {formula?.name || '...'}</span>
        </Tooltip>
      </h1>
      {iaEval && (
        <div>
          <PreviewParfum
            name={formula?.name || 'Formule'}
            ingredients={current.items.map((it: any) => {
              const ing = ingredients.find(i => i.id === it.ingredientId);
              return {
                name: ing?.name || it.ingredientId,
                percent: it.percent,
                noteLevel: ing?.noteLevel
              };
            })}
            iaEval={iaEval}
          />
          <div className="panel" style={{background:'#e6f7f7', color:'#0f766e', marginBottom:'1rem'}}>
            <div style={{marginTop:'0.5rem', color:'#0a4f4f'}}>
              <b>Conseils & solutions IA :</b>
              <ul>
                {iaSolutions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
      {!current && <p>Aucune version.</p>}
      {current && (
        <>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem' }}>
            <div style={{ flex:'1 1 520px', minWidth:320 }}>
              <div className="panel">
                <h3>Versions</h3>
                <select value={selectedVersionIdx} onChange={e=>setSelectedVersionIdx(Number(e.target.value))}>
                  {vs.map((v,i)=><option value={i} key={v.id}>v{v.versionNumber}</option>)}
                </select>
                {volatility && (
                  <p>Volatilité brute: Top {volatility.topPct.toFixed(1)}% | Coeur {volatility.heartPct.toFixed(1)}% | Base {volatility.basePct.toFixed(1)}%</p>
                )}
                <table style={{width:'100%'}}>
                  <thead><tr><th>Ingrédient</th><th>%</th><th>Note</th></tr></thead>
                  <tbody>
                    {current.items.map(it => {
                      const ing = ingredients.find(i=>i.id===it.ingredientId);
                      return (
                        <tr key={it.ingredientId}>
                          <td>{ing?.name || it.ingredientId}</td>
                          <td>{it.percent}</td>
                          <td>{ing?.noteLevel}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Link to={`/formulas/${id}/evaluations`}>Évaluations</Link>
              </div>
              <SafetyAlerts version={current} />
              {previous && (
                <div className="panel">
                  <h3>Diff (v{previous.versionNumber} {'->'} v{current.versionNumber})</h3>
                  <table style={{width:'100%'}}>
                    <thead><tr><th>Ingrédient</th><th>From</th><th>To</th><th>Δ</th><th>Δ %</th></tr></thead>
                    <tbody>
                      {diffs.map(d => {
                        const ing = ingredients.find(i=>i.id===d.ingredientId);
                        return (
                          <tr key={d.ingredientId} style={{color: Math.abs(d.delta) > 2 ? 'var(--accent)' : 'inherit'}}>
                            <td>{ing?.name || d.ingredientId}</td>
                            <td>{d.from}</td>
                            <td>{d.to}</td>
                            <td>{d.delta.toFixed(2)}</td>
                            <td>{d.rel.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <SuggestionsPanel version={current} />
            </div>
            <div style={{ flex:'0 1 320px', minWidth:300 }}>
              <VolatilityChart version={current} ingredients={ingredients} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}