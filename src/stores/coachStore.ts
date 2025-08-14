import { create } from 'zustand';
import { buildRules, lastEventTime, logCoachEvent } from '../services/coachEngine';
import { daysSinceLastBackup } from '../services/backupService';
import { db } from '../db/dexie';

interface CoachMessage {
  id: string;
  message: string;
  severity: 'info'|'warn'|'action';
  cta?: { label: string; action: string };
}

interface CoachState {
  messages: CoachMessage[];
  evaluating: boolean;
  evaluate(): Promise<void>;
  dismiss(id: string): void;
  act(action: string): void;
}

export const useCoachStore = create<CoachState>((set, get) => ({
  messages: [],
  evaluating: false,
  async evaluate() {
    set({ evaluating: true });
    const [ingredientCount, formulaCount] = await Promise.all([
      db.ingredients.count(),
      db.formulas.count()
    ]);
    const lastBackupDays = await daysSinceLastBackup();
    const ctx = { ingredientCount, formulaCount, lastBackupDays };
    const rules = buildRules();
    const msgs: CoachMessage[] = [];
    for (const r of rules) {
      if (r.condition(ctx)) {
        const last = await lastEventTime('rule:' + r.id);
        if (r.cooldownMs && last && Date.now() - last < r.cooldownMs) continue;
        msgs.push({ id: r.id, message: r.message, severity: r.severity, cta: r.cta });
        await logCoachEvent('rule:' + r.id);
      }
    }
    set({ messages: msgs, evaluating: false });
  },
  dismiss(id) {
    set(state => ({ messages: state.messages.filter(m => m.id !== id) }));
  },
  act(action) {
    if (action === 'goto_onboarding') location.href = '/onboarding';
    if (action === 'goto_formulas') location.href = '/formulas';
    if (action === 'goto_settings') location.href = '/settings';
  }
}));