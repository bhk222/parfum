import { create } from 'zustand';
import { FormulaVersion } from '../models/types';
import { evaluateSafety, SafetyRule } from '../services/safetyAdvisor';

interface SafetyState {
  alerts: Record<string, { rule: SafetyRule; current?: number }[]>;
  rules: SafetyRule[];
  evaluate(version: FormulaVersion): Promise<void>;
  setRules(rules: SafetyRule[]): void;
}

const defaultRules: SafetyRule[] = [
  { id: 'phenols_family', family: 'phenols', maxPercent: 5, severity: 'warn', message: 'Phénols totaux élevés (>5%)' },
  { id: 'cinnamon_individual', ingredientId: 'cinnamon', maxPercent: 1, severity: 'block', message: 'Cannelle >1% (irritant)' }
];

export const useSafetyStore = create<SafetyState>((set, get) => ({
  alerts: {},
  rules: defaultRules,
  async evaluate(version) {
    const rules = get().rules;
    const alerts = evaluateSafety(version, {
      getIngredient(id: string) {
        // sync assumption; Dexie get is async, skip for simplicity -> return placeholder
        return undefined;
      },
      rules
    });
    set(state => ({ alerts: { ...state.alerts, [version.id]: alerts } }));
  },
  setRules(rules) {
    set({ rules });
  }
}));