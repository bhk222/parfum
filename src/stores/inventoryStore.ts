import { create } from 'zustand';
import { Ingredient } from '../models/types';
import { listIngredients, addIngredient, updateIngredient, removeIngredient } from '../services/inventoryService';

interface InventoryState {
  ingredients: Ingredient[];
  loading: boolean;
  load(): Promise<void>;
  add(data: Omit<Ingredient,'id'|'createdAt'|'updatedAt'>): Promise<void>;
  update(id: string, patch: Partial<Ingredient>): Promise<void>;
  remove(id: string): Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  ingredients: [],
  loading: false,
  async load() {
    set({ loading: true });
    const items = await listIngredients();
    set({ ingredients: items, loading: false });
  },
  async add(data) {
    await addIngredient(data);
    await get().load();
  },
  async update(id, patch) {
    await updateIngredient(id, patch);
    await get().load();
  },
  async remove(id) {
    await removeIngredient(id);
    await get().load();
  }
}));