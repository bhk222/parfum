export type NoteLevel = 'top' | 'heart' | 'base';

export interface Ingredient {
  id: string;
  name: string;
  family: string;             // ex: citrus, floral...
  noteLevel: NoteLevel;
  volatilityScore: number;    // 0..1 (0 base, 1 très volatile)
  maxDilution?: number;       // %
  safetyFlags?: string[];
  density?: number;           // g/ml
  createdAt: number;
  updatedAt: number;
}

export interface Formula {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  currentVersionId?: string;
}

export interface FormulaVersion {
  id: string;
  formulaId: string;
  versionNumber: number;
  items: { ingredientId: string; percent: number }[];
  notes?: string;
  createdAt: number;
  parentVersionId?: string;
}

export interface Evaluation {
  id: string;
  formulaVersionId: string;
  timePoint: string; // '0h' | '1h' | '24h' | '168h' | custom
  attributes: {
    ouverture?: number;
    coeur?: number;
    fond?: number;
    tenue?: number;
    satisfaction?: number;
  };
  comment?: string;
  createdAt: number;
}

export interface AdjustmentSuggestion {
  id: string;
  formulaVersionId: string;
  generatedAt: number;
  rulesApplied: string[];
  suggestions: {
    ingredientId: string;
    deltaPercent: number;
    rationale: string;
  }[];
}

export interface Reminder {
  id: string;
  targetType: 'evaluation';
  targetId: string;
  scheduleAt: number;
  status: 'pending' | 'fired' | 'dismissed';
}

export interface CoachEvent {
  id: string;
  type: string;
  context?: any;
  createdAt: number;
  actionTaken?: string;
}

export interface BackupLog {
  id: string;
  executedAt: number;
  fileHash: string;
}

export interface TipLog {
  id: string;
  code: string;
  shownAt: number;
  accepted?: boolean;
}