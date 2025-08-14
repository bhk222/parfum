export type AllergenKey = 'limonene' | 'linalool' | 'geraniol' | 'citral' | 'coumarin';

export interface Material {
  id: string;
  name: string;
  latinName?: string;
  family?: string;
  noteType?: 'TOP' | 'HEART' | 'BASE';
  density?: number; // g/ml
  costPerKg?: number;
  stockGrams?: number;
  allergens?: Partial<Record<AllergenKey, number>>; // fraction massique (0-1)
  volatility?: 'HIGH' | 'MEDIUM' | 'LOW';
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Ingredient {
  materialId: string;
  amount: number; // valeur saisie
  amountType: 'WEIGHT' | 'PERCENT';
  order: number;
}

export interface Formula {
  id: string;
  name: string;
  description?: string;
  currentVersionId?: string;
  createdAt: number;
}

export interface FormulaVersion {
  id: string;
  formulaId: string;
  versionNumber: number;
  ingredients: Ingredient[];
  comment?: string;
  createdAt: number;
}

export interface Evaluation {
  id: string;
  formulaVersionId: string;
  date: number;
  dilutionPercent?: number;
  medium?: 'ethanol' | 'oil';
  notes?: string;
  intensity?: number;
  longevityHoursEst?: number;
}

export interface Settings {
  id: string;
  preferredUnit?: 'g' | 'ml';
  theme?: 'light' | 'dark';
  lastBackup?: number;
}