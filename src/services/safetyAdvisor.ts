import { FormulaVersion } from '../models/types';

export interface SafetyRule {
  id: string;
  ingredientId?: string;
  family?: string;
  maxPercent: number;
  severity: 'warn' | 'block';
  message: string;
}

export function evaluateSafety(
  version: FormulaVersion,
  context: {
    getIngredient(id: string): { family?: string } | undefined;
    rules: SafetyRule[];
  }
) {
  const aggregated: Record<string, number> = {};
  version.items.forEach(i => { aggregated[i.ingredientId] = i.percent; });

  const alerts: { rule: SafetyRule; current?: number }[] = [];
  for (const rule of context.rules) {
    if (rule.ingredientId && aggregated[rule.ingredientId] != null) {
      const current = aggregated[rule.ingredientId];
      if (current > rule.maxPercent) alerts.push({ rule, current });
    } else if (rule.family) {
      const totalFamily = version.items
        .filter(i => context.getIngredient(i.ingredientId)?.family === rule.family)
        .reduce((a, b) => a + b.percent, 0);
      if (totalFamily > rule.maxPercent) {
        alerts.push({ rule, current: totalFamily });
      }
    }
  }
  return alerts;
}