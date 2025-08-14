import { db } from '../db/dexie';
import { CoachEvent } from '../models/types';
import { nanoId } from '../utils/id';

export interface CoachRule {
  id: string;
  condition(ctx: CoachContext): boolean;
  message: string;
  severity: 'info'|'warn'|'action';
  cta?: { label: string; action: string };
  cooldownMs?: number;
}

export interface CoachContext {
  ingredientCount: number;
  formulaCount: number;
  lastBackupDays?: number;
}

export function buildRules(): CoachRule[] {
  return [
    {
      id: 'ia_suggestion',
      condition: c => c.ingredientCount >= 7 && c.formulaCount < 3,
      message: 'Suggestion IA : Essayez une formule fraîche et boisée avec Romarin, Cyprès, Zeste de citron et Ylang-ylang. Pour un effet aromatique, ajoutez Menthe poivrée et Eucalyptus. Pour la profondeur, intégrez Oliban.',
      severity: 'action',
      cta: { label: 'Créer cette formule', action: 'goto_formulas' },
      cooldownMs: 6 * 60 * 60 * 1000
    },
    {
      id: 'no_formulas',
      condition: c => c.formulaCount === 0 && c.ingredientCount >= 3,
      message: 'Crée ta première formule maintenant.',
      severity: 'action',
      cta: { label: 'Nouvelle formule', action: 'goto_formulas' },
      cooldownMs: 6 * 60 * 60 * 1000
    },
    {
      id: 'backup_needed',
      condition: c => (c.lastBackupDays ?? 0) > 7,
      message: 'Aucun backup récent. Pense à exporter tes données.',
      severity: 'warn',
      cta: { label: 'Exporter', action: 'goto_settings' },
      cooldownMs: 12 * 60 * 60 * 1000
    }
  ];
}

export async function logCoachEvent(type: string, context?: any) {
  const ev: CoachEvent = { id: nanoId(), type, context, createdAt: Date.now() };
  await db.coachEvents.add(ev);
}

export async function lastEventTime(type: string) {
  const ev = await db.coachEvents.where({ type }).last();
  return ev?.createdAt;
}