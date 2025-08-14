import React, { useEffect, useRef } from 'react';

// Hook léger pour charger uPlot dynamiquement et monter un graphique
export function useUPlot(
  options: any,
  data: any,
  deps: any[] = []
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const plotRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { default: UPlot } = await import('uplot');
      if (!mounted || !containerRef.current) return;

      if (plotRef.current) {
        plotRef.current.setData(data);
        plotRef.current.setSize({ width: options.width, height: options.height });
      } else {
        plotRef.current = new UPlot(options, data, containerRef.current);
      }
    })();

    return () => {
      mounted = false;
      if (plotRef.current) {
        plotRef.current.destroy();
        plotRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}

export const ChartShell: React.FC<{
  title?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, children, style }) => (
  <div className="panel" style={{ overflow: 'hidden', ...style }}>
    {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
    {children}
  </div>
);