import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { Material } from '../domain/types';
import { MaterialsList } from './MaterialsList';
import { NewMaterialForm } from './NewMaterialForm';

export const App: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    // Pour simplifier, on recharge après chaque modif
    db.materials.hook('creating', () => refresh());
    db.materials.hook('updating', () => refresh());
    db.materials.hook('deleting', () => refresh());
    function refresh() {
      db.materials.orderBy('name').toArray().then(setMaterials);
    }
    return () => {
    db.materials.hook('creating').unsubscribe(() => {});
    db.materials.hook('updating').unsubscribe(() => {});
    db.materials.hook('deleting').unsubscribe(() => {});
    };
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui' }}>
      <h1>Parfumeur Offline</h1>
      <NewMaterialForm onCreated={() => {}} />
      <MaterialsList materials={materials} />
    </div>
  );
};