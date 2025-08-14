import { Ingredient, Material } from './types';

interface NormalizedIngredient extends Ingredient {
  percent: number;
  weight: number;
}

export function normalizeIngredients(
  ingredients: Ingredient[],
  materialsById: Record<string, Material>,
  targetTotalWeight = 100
): NormalizedIngredient[] {
  // Convert tout en poids provisoire
  const temp = ingredients.map(i => {
    if (i.amountType === 'WEIGHT') {
      return { ...i, weight: i.amount };
    }
    // amountType = PERCENT
    return { ...i, weight: (i.amount / 100) * targetTotalWeight };
  });
  const total = temp.reduce((s, x) => s + x.weight, 0) || 1;
  return temp.map(i => ({
    ...i,
    percent: (i.weight / total) * 100
  }));
}

export function computeCostPer100g(
  normalized: NormalizedIngredient[],
  materialsById: Record<string, Material>
): number {
  let totalCost = 0;
  normalized.forEach(ing => {
    const mat = materialsById[ing.materialId];
    if (mat?.costPerKg) {
      const costPerGram = mat.costPerKg / 1000;
      totalCost += ing.weight * costPerGram;
    }
  });
  const totalWeight = normalized.reduce((s, n) => s + n.weight, 0) || 1;
  // Ramener à 100 g
  return (totalCost / totalWeight) * 100;
}

export function aggregateAllergens(
  normalized: NormalizedIngredient[],
  materialsById: Record<string, Material>
): Record<string, number> {
  const sums: Record<string, number> = {};
  const totalWeight = normalized.reduce((s, n) => s + n.weight, 0) || 1;
  normalized.forEach(ing => {
    const mat = materialsById[ing.materialId];
    if (mat?.allergens) {
      Object.entries(mat.allergens).forEach(([k, fraction]) => {
        if (fraction != null) {
          sums[k] = (sums[k] || 0) + fraction * ing.weight;
        }
      });
    }
  });
  // Convertir en pourcentage massique final
  Object.keys(sums).forEach(k => {
    sums[k] = (sums[k] / totalWeight) * 100;
  });
  return sums;
}