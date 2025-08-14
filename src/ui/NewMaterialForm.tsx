import React, { useState } from 'react';
import { db } from '../db';
import { Material } from '../domain/types';

export const NewMaterialForm: React.FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [noteType, setNoteType] = useState<'TOP' | 'HEART' | 'BASE' | ''>('');
  const [cost, setCost] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const now = Date.now();
    const mat: Material = {
      id: crypto.randomUUID(),
      name: name.trim(),
      noteType: noteType || undefined,
      costPerKg: cost ? parseFloat(cost) : undefined,
      createdAt: now,
      updatedAt: now
    };
    await db.materials.add(mat);
    setName('');
    setNoteType('');
    setCost('');
    onCreated();
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
      <input placeholder="Nom matière" value={name} onChange={e => setName(e.target.value)} />
      <select value={noteType} onChange={e => setNoteType(e.target.value as any)}>
        <option value="">Note</option>
        <option value="TOP">Tête</option>
        <option value="HEART">Cœur</option>
        <option value="BASE">Fond</option>
      </select>
      <input placeholder="Coût €/kg" type="number" value={cost} onChange={e => setCost(e.target.value)} />
      <button type="submit">Ajouter</button>
    </form>
  );
};