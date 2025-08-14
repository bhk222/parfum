import { db } from '../db';

export async function exportAll(): Promise<Blob> {
  const data = {
    materials: await db.materials.toArray(),
    formulas: await db.formulas.toArray(),
    formulaVersions: await db.formulaVersions.toArray(),
    evaluations: await db.evaluations.toArray(),
    settings: await db.settings.toArray()
  };
  const json = JSON.stringify(data, null, 2);
  return new Blob([json], { type: 'application/json' });
}

export async function importAll(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  await db.transaction('rw', db.formulas, db.formulaVersions, db.evaluations, db.settings, async () => {
    if (data.materials) await db.materials.bulkPut(data.materials);
    if (data.formulas) await db.formulas.bulkPut(data.formulas);
    if (data.formulaVersions) await db.formulaVersions.bulkPut(data.formulaVersions);
    if (data.evaluations) await db.evaluations.bulkPut(data.evaluations);
    if (data.settings) await db.settings.bulkPut(data.settings);
  });
}