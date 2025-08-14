import { create } from 'zustand';
import { scheduleReminder, listRemindersForVersion, markReminder } from '../services/reminderService';
import { Reminder } from '../models/types';

interface ReminderState {
  byVersion: Record<string, Reminder[]>;
  load(versionId: string): Promise<void>;
  schedule(data: Omit<Reminder,'id'|'status'>): Promise<void>;
  mark(id: string, status: Reminder['status']): Promise<void>;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  byVersion: {},
  async load(versionId) {
    const list = await listRemindersForVersion(versionId);
    set(state => ({ byVersion: { ...state.byVersion, [versionId]: list } }));
  },
  async schedule(data) {
    await scheduleReminder(data);
    await get().load(data.targetId);
  },
  async mark(id, status) {
    await markReminder(id, status);
  }
}));