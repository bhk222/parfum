import { create } from 'zustand';
import { Evaluation } from '../models/types';
import { addEvaluation, listEvaluationsForVersion } from '../services/evaluationService';

interface EvalState {
  evaluations: Record<string, Evaluation[]>;
  loading: boolean;
  load(versionId: string): Promise<void>;
  add(data: Omit<Evaluation,'id'|'createdAt'>): Promise<void>;
}

export const useEvaluationStore = create<EvalState>((set, get) => ({
  evaluations: {},
  loading: false,
  async load(versionId) {
    set({ loading: true });
    const list = await listEvaluationsForVersion(versionId);
    set(state => ({
      evaluations: { ...state.evaluations, [versionId]: list },
      loading: false
    }));
  },
  async add(data) {
    await addEvaluation(data);
    await get().load(data.formulaVersionId);
  }
}));