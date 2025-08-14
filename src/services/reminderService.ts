import { db } from '../db/dexie';
import { Reminder } from '../models/types';
import { nanoId } from '../utils/id';

export async function scheduleReminder(data: Omit<Reminder,'id'|'status'>) {
  const r: Reminder = {
    id: nanoId(),
    status: 'pending',
    ...data
  };
  await db.reminders.add(r);
  return r;
}

export async function listPendingReminders() {
  const now = Date.now();
  return db.reminders.where('[scheduleAt+status]').between([0,'pending'], [now,'pending']).toArray();
}

export async function listRemindersForVersion(versionId: string) {
  return db.reminders.where({ targetId: versionId }).toArray();
}

export async function markReminder(id: string, status: Reminder['status']) {
  await db.reminders.update(id, { status });
}