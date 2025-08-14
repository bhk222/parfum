import { create } from 'zustand';
import { Formula, FormulaVersion } from '../models/types';
import { listFormulas, getFormulaVersions, createFormula, createNextVersion, getFormulaVersion } from '../services/formulaService';

interface FormulaState {
  formulas: Formula[];
  versions: Record<string, FormulaVersion[]>;
  currentVersion: FormulaVersion | null;
  loading: boolean;
  loadFormulas(): Promise<void>;
  loadVersions(formulaId: string): Promise<void>;
  create(name: string, items: { ingredientId: string; percent: number }[]): Promise<void>;
  newVersion(formulaId: string, prev: FormulaVersion, items: FormulaVersion['items']): Promise<FormulaVersion>;
  loadVersion(id: string): Promise<void>;
}

export const useFormulaStore = create<FormulaState>((set, get) => ({
  formulas: [],
  versions: {},
  currentVersion: null,
  loading: false,
  async loadFormulas() {
    set({ loading: true });
    const fs = await listFormulas();
    set({ formulas: fs, loading: false });
  },
  async loadVersions(formulaId) {
    const vs = await getFormulaVersions(formulaId);
    set(state => ({ versions: { ...state.versions, [formulaId]: vs } }));
  },
  async create(name, items) {
    await createFormula(name, items);
    await get().loadFormulas();
  },
  async newVersion(formulaId, prev, items) {
    const v = await createNextVersion(formulaId, prev, items);
    await get().loadVersions(formulaId);
    return v;
  },
  async loadVersion(id) {
    const v = await getFormulaVersion(id);
    set({ currentVersion: v ?? null });
  }
}));