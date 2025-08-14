import React from 'react';
import { Material } from '../domain/types';

export const MaterialsList: React.FC<{ materials: Material[] }> = ({ materials }) => {
  if (!materials.length) return <div>Aucune matière pour le moment.</div>;
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={th}>Nom</th>
          <th style={th}>Note</th>
          <th style={th}>Coût €/kg</th>
        </tr>
      </thead>
      <tbody>
        {materials.map(m => (
          <tr key={m.id}>
            <td style={td}>{m.name}</td>
            <td style={td}>{m.noteType || '-'}</td>
            <td style={td}>{m.costPerKg ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const th: React.CSSProperties = { borderBottom: '1px solid #ccc', textAlign: 'left', padding: '4px' };
const td: React.CSSProperties = { borderBottom: '1px solid #eee', padding: '4px', fontSize: '0.9rem' };