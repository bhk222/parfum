import { FormulaVersion } from '../../models/types';
import { useSuggestionStore } from '../../stores/suggestionStore';
import { useEvaluationStore } from '../../stores/evaluationStore';
import { useEffect } from 'react';

export default function SuggestionsPanel({ version }: { version: FormulaVersion }) {
  const { suggestions, generate, load, generating } = useSuggestionStore();
  const { evaluations, load: loadEvaluations } = useEvaluationStore();
  const s = suggestions[version.id];
  const evals = evaluations[version.id] || [];

  useEffect(() => {
    load(version.id);
    loadEvaluations(version.id);
  }, [version.id, load, loadEvaluations]);

  return (
    <div className="panel">
      <h3>Suggestions d'ajustement</h3>
      {s ? (
        s.suggestions.length ? (
          <ul>
            {s.suggestions.map((it, idx) => (
              <li key={idx}>Ingrédient {it.ingredientId} : {it.deltaPercent > 0 ? '+' : ''}{it.deltaPercent}% — {it.rationale}</li>
            ))}
          </ul>
        ) : <p>Aucune suggestion pertinente.</p>
      ) : <p>Aucune suggestion générée.</p>}
      <button disabled={generating || !evals.length} onClick={()=>generate(version)}>
        {generating ? 'Génération...' : evals.length ? 'Générer suggestions' : 'Besoin d’évaluations'}
      </button>
    </div>
  );
}