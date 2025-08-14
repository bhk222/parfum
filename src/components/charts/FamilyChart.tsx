import React, { useMemo } from 'react';
import { Ingredient } from '../../models/types';
import { useUPlot, ChartShell } from './useUPlot';

interface Props {
  ingredients: Ingredient[];
  height?: number;
  width?: number;
}

export const FamilyChart: React.FC<Props> = ({ ingredients, height = 220, width = 480 }) => {
  const { labels, counts } = useMemo(() => {
    const map = new Map<string, number>();
    ingredients.forEach(i => map.set(i.family || 'Autre', (map.get(i.family || 'Autre') ?? 0) + 1));
    const entries = [...map.entries()].sort((a, b) => b[1] - a[1]);
    return {
      labels: entries.map(e => e[0]),
      counts: entries.map(e => e[1])
    };
  }, [ingredients]);

  const x = labels.map((_, i) => i);
  const y = counts;
  const data = [x, y];

  const ref = useUPlot(
    {
      width,
      height,
      title: '',
      scales: {
        x: { time: false },
        y: { auto: true }
      },
      axes: [
        {
          space: 40,
          values: (u: any, splits: number[]) => splits.map(i => labels[i] ?? '')
        },
        {
          values: (u: any, splits: number[]) => splits.map(v => v.toString())
        }
      ],
      series: [
        {},
        {
          label: 'Ingrédients',
          points: { show: false },
          stroke: 'var(--accent)',
          fill: 'rgba(14,165,233,0.25)',
          width: 2
        }
      ]
    },
    data,
    [labels.join('|'), y.join(','), width, height]
  );

  return (
    <ChartShell title="Répartition familles">
      <div ref={ref} />
      <small style={{ opacity: 0.7 }}>Total: {ingredients.length}</small>
    </ChartShell>
  );
};