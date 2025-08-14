import React, { useMemo } from 'react';
import { Evaluation } from '../../models/types';
import { useUPlot, ChartShell } from './useUPlot';

interface Props {
  evaluations: Evaluation[];
  width?: number;
  height?: number;
  series?: (keyof Evaluation['attributes'])[];
}

// Convertit timePoint ('0h','1h','24h','168h','custom') -> nb d'heures
function tpToHours(tp: string): number {
  const m = /^(\d+)\s*h$/i.exec(tp);
  if (m) return parseInt(m[1], 10);
  if (tp === '0h') return 0;
  return 0;
}

const DEFAULT_SERIES: (keyof Evaluation['attributes'])[] = [
  'ouverture',
  'coeur',
  'fond',
  'tenue',
  'satisfaction'
];

export const EvaluationChart: React.FC<Props> = ({
  evaluations,
  width = 560,
  height = 300,
  series = DEFAULT_SERIES
}) => {
  const { data, uSeries } = useMemo(() => {
    const sorted = [...evaluations].sort(
      (a, b) => tpToHours(a.timePoint) - tpToHours(b.timePoint) || a.createdAt - b.createdAt
    );
    const xAxis = sorted.map(e => tpToHours(e.timePoint));
    const colors = ['#0ea5e9', '#6366f1', '#f59e0b', '#10b981', '#ec4899', '#84cc16'];

    const uSeries = [
      {},
      ...series.map((s, idx) => ({
        label: s,
        stroke: colors[idx % colors.length],
        width: 2,
        points: { show: true }
      }))
    ];

    const matrix = [
      xAxis,
      ...series.map(s => sorted.map(e => e.attributes[s] ?? null))
    ];

    return { data: matrix, uSeries };
  }, [evaluations, series]);

  const ref = useUPlot(
    {
      width,
      height,
      scales: {
        x: { time: false },
        y: { range: [0, 1] }
      },
      axes: [
        {
          values: (u: any, splits: number[]) => splits.map(v => `${v}h`)
        },
        {
          values: (u: any, splits: number[]) => splits.map(v => (v * 100).toFixed(0))
        }
      ],
      series: uSeries,
      legend: { show: true }
    },
    data,
    [evaluations.length, width, height]
  );

  if (!evaluations.length) {
    return (
      <ChartShell title="Évolution sensorielle">
        <p style={{ margin: 0 }}>Pas encore d'évaluations.</p>
      </ChartShell>
    );
  }

  return (
    <ChartShell title="Évolution sensorielle">
      <div ref={ref} />
      <small style={{ opacity: 0.7 }}>Axes: X=heures, Y=score (%)</small>
    </ChartShell>
  );
};