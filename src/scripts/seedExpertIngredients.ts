
const expertIngredients = [
  { name: 'Romarin', family: 'Aromatique', noteLevel: 'top' as NoteLevel, volatilityScore: 0.8 },
  { name: 'Cyprès', family: 'Boisé', noteLevel: 'heart' as NoteLevel, volatilityScore: 0.6 },
  { name: 'Zeste de citron', family: 'Agrume', noteLevel: 'top' as NoteLevel, volatilityScore: 0.9 },
  { name: 'Menthe poivrée', family: 'Aromatique', noteLevel: 'top' as NoteLevel, volatilityScore: 0.85 },
  { name: 'Oliban', family: 'Résineux', noteLevel: 'base' as NoteLevel, volatilityScore: 0.3 },
  { name: 'Eucalyptus', family: 'Aromatique', noteLevel: 'top' as NoteLevel, volatilityScore: 0.8 },
  { name: 'Ylang-ylang', family: 'Florale', noteLevel: 'heart' as NoteLevel, volatilityScore: 0.7 }
];

import { nanoId } from '../utils/id';
import { NoteLevel } from '../models/types';
import { db } from '../db/dexie';

async function seedIngredients() {
  for (const ing of expertIngredients) {
    await db.ingredients.put({
      id: nanoId(),
      name: ing.name,
      family: ing.family,
  noteLevel: ing.noteLevel as NoteLevel,
      volatilityScore: ing.volatilityScore,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
  console.log('Ingrédients experts ajoutés !');
}

seedIngredients();
