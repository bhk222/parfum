import { db } from '../db/dexie';
import { Formula, FormulaVersion } from '../models/types';
import { nanoId } from '../utils/id';

export async function createFormula(name: string, items: { ingredientId: string; percent: number }[]) {
  const now = Date.now();
  const formula: Formula = { id: nanoId(), name, createdAt: now, updatedAt: now };
  await db.formulas.add(formula);
  const version: FormulaVersion = {
    id: nanoId(),
    formulaId: formula.id,
    versionNumber: 1,
    items,
    createdAt: now
  };
  await db.formulaVersions.add(version);
  await db.formulas.update(formula.id, { currentVersionId: version.id });
  return { formula, version };
}

export async function listFormulas() {
  return db.formulas.toArray();
}

export async function getFormulaVersions(formulaId: string) {
  return db.formulaVersions.where({ formulaId }).sortBy('versionNumber');
}

export async function getFormulaVersion(id: string) {
  return db.formulaVersions.get(id);
}

export async function cloneVersion(newName: string, baseVersion: FormulaVersion) {
  const now = Date.now();
  const newFormula: Formula = {
    id: nanoId(),
    name: newName,
    createdAt: now,
    updatedAt: now,
    currentVersionId: undefined
  };
  await db.formulas.add(newFormula);
  const version: FormulaVersion = {
    id: nanoId(),
    formulaId: newFormula.id,
    versionNumber: 1,
    items: JSON.parse(JSON.stringify(baseVersion.items)),
    createdAt: now,
    parentVersionId: baseVersion.id
  };
  await db.formulaVersions.add(version);
  await db.formulas.update(newFormula.id, { currentVersionId: version.id });
  return { newFormula, version };
}

export async function createNextVersion(formulaId: string, prev: FormulaVersion, items: FormulaVersion['items']) {
  const now = Date.now();
  const next: FormulaVersion = {
    id: nanoId(),
    formulaId,
    versionNumber: prev.versionNumber + 1,
    items,
    createdAt: now,
    parentVersionId: prev.id
  };
  await db.formulaVersions.add(next);
  await db.formulas.update(formulaId, { updatedAt: now, currentVersionId: next.id });
  return next;
}