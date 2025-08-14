import { create } from 'zustand';
import { AdjustmentSuggestion, FormulaVersion } from '../models/types';
import { db } from '../db/dexie';
import { generateAdjustmentSuggestion } from '../services/suggestionEngine';

interface SuggestState {
  suggestions: Record<string, AdjustmentSuggestion | null>;
  generating: boolean;
  generate(version: FormulaVersion): Promise<void>;
  load(versionId: string): Promise<void>;
}

export const useSuggestionStore = create<SuggestState>((set) => ({
  suggestions: {},
  generating: false,
  async generate(version) {
    set({ generating: true });
    const sug = await generateAdjustmentSuggestion(version, {
  async getEvaluations(versionId: string) {
        return db.evaluations.where({ formulaVersionId: versionId }).toArray();
      },
      getIngredientNoteLevel(id: string) {
        // This is async in Dexie; simplification below
        // (Better: rewrite generateAdjustmentSuggestion to support async resolver)
        return undefined;
      }
    } as any);
    if (sug) {
      await db.adjustmentSuggestions.add(sug);
      set(state => ({ suggestions: { ...state.suggestions, [version.id]: sug }, generating: false }));
    } else {
      set(state => ({ suggestions: { ...state.suggestions, [version.id]: null }, generating: false }));
    }
  },
  async load(versionId) {
    const s = await db.adjustmentSuggestions.where({ formulaVersionId: versionId }).last();
    set(state => ({ suggestions: { ...state.suggestions, [versionId]: s ?? null } }));
  }
}));