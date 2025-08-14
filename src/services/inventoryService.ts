import { db } from '../db/dexie';
import { Ingredient } from '../models/types';
import { nanoId } from '../utils/id';

export async function addIngredient(data: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = Date.now();
  const ingredient: Ingredient = { id: nanoId(), createdAt: now, updatedAt: now, ...data };
  await db.ingredients.add(ingredient);
  return ingredient;
}

export async function listIngredients() {
  return db.ingredients.toArray();
}

export async function updateIngredient(id: string, patch: Partial<Ingredient>) {
  await db.ingredients.update(id, { ...patch, updatedAt: Date.now() });
}

export async function removeIngredient(id: string) {
  await db.ingredients.delete(id);
}