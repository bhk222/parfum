import Dexie, { Table } from 'dexie';
import { Material, Formula, FormulaVersion, Evaluation, Settings } from './domain/types';

class ParfumeurDB extends Dexie {
  materials!: Table<Material, string>;
  formulas!: Table<Formula, string>;
  formulaVersions!: Table<FormulaVersion, string>;
  evaluations!: Table<Evaluation, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super('ParfumeurDB');
    this.version(1).stores({
      materials: 'id,name, family, noteType',
      formulas: 'id,name',
      formulaVersions: 'id,formulaId,versionNumber',
      evaluations: 'id,formulaVersionId,date',
      settings: 'id'
    });
  }
}

export const db = new ParfumeurDB();