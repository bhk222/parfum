import { db } from '../db/dexie';
import { TipLog } from '../models/types';
import { nanoId } from '../utils/id';

export async function logTip(code: string, accepted?: boolean) {
  const entry: TipLog = { id: nanoId(), code, shownAt: Date.now(), accepted };
  await db.tipsLogs.add(entry);
}

export async function hasTipBeenShown(code: string) {
  const count = await db.tipsLogs.where({ code }).count();
  return count > 0;
}