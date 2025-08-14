import { AdjustmentSuggestion, FormulaVersion, Evaluation } from '../models/types';
import { nanoId } from '../utils/id';

interface Context {
  getEvaluations(versionId: string): Promise<Evaluation[]>;
  getIngredientNoteLevel(id: string): 'top'|'heart'|'base'|undefined;
}

export async function generateAdjustmentSuggestion(
  version: FormulaVersion,
  ctx: Context
): Promise<AdjustmentSuggestion | null> {
  const evals = await ctx.getEvaluations(version.id);
  if (!evals.length) return null;

  // Agrégation simple (moyenne)
  const agg = evals.reduce((acc, e) => {
    Object.entries(e.attributes).forEach(([k, v]) => {
      if (typeof v === 'number') {
        acc[k] = (acc[k] ?? 0) + v;
      }
    });
    return acc;
  }, {} as Record<string, number>);
  Object.keys(agg).forEach(k => agg[k] /= evals.length);

  const rulesApplied: string[] = [];
  const suggestions: AdjustmentSuggestion['suggestions'] = [];

  // Règle tenue faible
  if ((agg.tenue ?? 1) < 0.5) {
    const baseCandidate = version.items.find(it => ctx.getIngredientNoteLevel(it.ingredientId) === 'base');
    if (baseCandidate) {
      suggestions.push({
        ingredientId: baseCandidate.ingredientId,
        deltaPercent: +1,
        rationale: 'Tenue faible détectée, augmente légèrement une note de fond.'
      });
      rulesApplied.push('low_tenue_boost_base');
    }
  }

  if (!suggestions.length) return null;

  return {
    id: nanoId(),
    formulaVersionId: version.id,
    generatedAt: Date.now(),
    rulesApplied,
    suggestions
  };
}