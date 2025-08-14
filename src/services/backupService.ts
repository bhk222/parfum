import { db } from '../db/dexie';
import { BackupLog } from '../models/types';
import { nanoId } from '../utils/id';

export async function recordBackup(hash: string) {
  const entry: BackupLog = {
    id: nanoId(),
    executedAt: Date.now(),
    fileHash: hash
  };
  await db.backupLogs.add(entry);
}

export async function daysSinceLastBackup(): Promise<number | undefined> {
  const last = await db.backupLogs.orderBy('executedAt').last();
  if (!last) return undefined;
  const diffMs = Date.now() - last.executedAt;
  return diffMs / 86400000;
}