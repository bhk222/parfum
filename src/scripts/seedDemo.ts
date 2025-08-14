// Script de seed (npm run seed)
// Nécessite: npm i -D ts-node
import { db } from '../db/dexie';
import { NoteLevel } from '../models/types';
import { nanoId } from '../utils/id';

async function main() {
  await db.open();
  console.log('Seeding demo data...');
  // Add sample ingredients
  const ingredients = [
  { name:'Citron', family:'citrus', noteLevel:'top' as NoteLevel, volatilityScore:0.9 },
  { name:'Bergamote', family:'citrus', noteLevel:'top' as NoteLevel, volatilityScore:0.85 },
  { name:'Lavande', family:'floral', noteLevel:'heart' as NoteLevel, volatilityScore:0.6 },
  { name:'Jasmin', family:'floral', noteLevel:'heart' as NoteLevel, volatilityScore:0.55 },
  { name:'Patchouli', family:'woody', noteLevel:'base' as NoteLevel, volatilityScore:0.2 },
  { name:'Vétiver', family:'woody', noteLevel:'base' as NoteLevel, volatilityScore:0.15 }
  ];
  for (const ing of ingredients) {
    const id = nanoId();
    await db.ingredients.put({
      id,
      name: ing.name,
      family: ing.family,
  noteLevel: ing.noteLevel as NoteLevel,
      volatilityScore: ing.volatilityScore,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
  const formulaId = nanoId();
  await db.formulas.add({
    id: formulaId,
    name: 'Cologne Demo',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    currentVersionId: undefined
  });
  const versionId = nanoId();
  await db.formulaVersions.add({
    id: versionId,
    formulaId,
    versionNumber: 1,
    createdAt: Date.now(),
    items: [
      { ingredientId: (await db.ingredients.where('name').equals('Citron').first())!.id, percent: 35 },
      { ingredientId: (await db.ingredients.where('name').equals('Bergamote').first())!.id, percent: 25 },
      { ingredientId: (await db.ingredients.where('name').equals('Lavande').first())!.id, percent: 20 },
      { ingredientId: (await db.ingredients.where('name').equals('Patchouli').first())!.id, percent: 10 },
      { ingredientId: (await db.ingredients.where('name').equals('Vétiver').first())!.id, percent: 10 }
    ]
  });
  await db.formulas.update(formulaId, { currentVersionId: versionId });
  console.log('Seed terminé.');
}

main().catch(e => {
  console.error(e);
});