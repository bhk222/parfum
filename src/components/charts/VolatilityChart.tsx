import React from 'react';
import { splitVolatility } from '../../utils/stats';
import { FormulaVersion } from '../../models/types';
import { Ingredient } from '../../models/types';
import { ChartShell } from './useUPlot';

interface Props {
  version: FormulaVersion;
  ingredients: Ingredient[];
}

export const VolatilityChart: React.FC<Props> = ({ version, ingredients }) => {
  const resolver = (id: string) => ingredients.find(i => i.id === id)?.noteLevel;
  const v = splitVolatility(version, resolver as any);

  const segments = [
    { label: 'Top', value: v.topPct, color: '#0ea5e9' },
    { label: 'Coeur', value: v.heartPct, color: '#6366f1' },
    { label: 'Base', value: v.basePct, color: '#f59e0b' }
  ];

  return (
    <ChartShell title="Ratios volatilité">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', height: 28, width: '100%', borderRadius: 6, overflow: 'hidden' }}>
          {segments.map(s => (
            <div
              key={s.label}
              style={{
                width: `${s.value}%`,
                background: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: '#fff',
                whiteSpace: 'nowrap'
              }}
              title={`${s.label} ${s.value.toFixed(1)}%`}
            >
              {s.value > 8 && `${s.label} ${s.value.toFixed(0)}%`}
            </div>
          ))}
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', gap: 12 }}>
          {segments.map(s => (
            <li key={s.label} style={{ fontSize: 12 }}>
              <span
                style={{
                  background: s.color,
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  marginRight: 4
                }}
              ></span>
              {s.label} {s.value.toFixed(1)}%
            </li>
          ))}
        </ul>
      </div>
    </ChartShell>
  );
};