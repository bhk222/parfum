import { db } from '../db/dexie';

interface ExportBundle {
  version: number;
  exportedAt: number;
  data: Record<string, any[]>;
  hash: string;
}

async function digest(str: string) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

export async function exportAll(): Promise<ExportBundle> {
  const data: ExportBundle['data'] = {
    ingredients: await db.ingredients.toArray(),
    formulas: await db.formulas.toArray(),
    formulaVersions: await db.formulaVersions.toArray(),
    evaluations: await db.evaluations.toArray(),
    adjustmentSuggestions: await db.adjustmentSuggestions.toArray(),
    reminders: await db.reminders.toArray(),
    coachEvents: await db.coachEvents.toArray(),
    backupLogs: await db.backupLogs.toArray(),
    tipsLogs: await db.tipsLogs.toArray()
  };
  const raw = JSON.stringify(data);
  const hash = await digest(raw);
  return { version: 1, exportedAt: Date.now(), data, hash };
}

export async function importBundle(bundle: ExportBundle, mode: 'merge' | 'replace' = 'merge') {
  if (!bundle || typeof bundle !== 'object') throw new Error('Invalid bundle');
  const { data } = bundle;
  if (mode === 'replace') {
    await db.transaction('rw', db.tables, async () => {
      await Promise.all(db.tables.map(t => t.clear()));
      for (const [k, arr] of Object.entries(data)) {
        // @ts-ignore
        if (db[k]) await db[k].bulkAdd(arr);
      }
    });
  } else {
    await db.transaction('rw', db.tables, async () => {
      for (const [k, arr] of Object.entries(data)) {
        // @ts-ignore
        if (db[k]) {
          for (const obj of arr) {
            // naive merge: upsert if absent
            // @ts-ignore
            const existing = await db[k].get(obj.id);
            if (!existing) {
              // @ts-ignore
              await db[k].add(obj);
            }
          }
        }
      }
    });
  }
}