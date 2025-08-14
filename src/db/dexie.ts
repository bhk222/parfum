import Dexie, { Table } from 'dexie';
import {
  Ingredient, Formula, FormulaVersion, Evaluation,
  AdjustmentSuggestion, Reminder, CoachEvent, BackupLog, TipLog
} from '../models/types';

class AppDB extends Dexie {
  ingredients!: Table<Ingredient, string>;
  formulas!: Table<Formula, string>;
  formulaVersions!: Table<FormulaVersion, string>;
  evaluations!: Table<Evaluation, string>;
  adjustmentSuggestions!: Table<AdjustmentSuggestion, string>;
  reminders!: Table<Reminder, string>;
  coachEvents!: Table<CoachEvent, string>;
  backupLogs!: Table<BackupLog, string>;
  tipsLogs!: Table<TipLog, string>;

  constructor() {
    super('parfums-db');
    this.version(1).stores({
      ingredients: 'id,name,family,noteLevel',
      formulas: 'id,name',
      formulaVersions: 'id,formulaId,versionNumber',
      evaluations: 'id,formulaVersionId,timePoint',
      adjustmentSuggestions: 'id,formulaVersionId',
      reminders: 'id,targetType,targetId,scheduleAt,status',
      coachEvents: 'id,type,createdAt',
      backupLogs: 'id,executedAt',
      tipsLogs: 'id,code,shownAt'
    });
  }
}

export const db = new AppDB();