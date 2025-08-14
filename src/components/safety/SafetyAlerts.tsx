import { FormulaVersion } from '../../models/types';
import { useSafetyStore } from '../../stores/safetyStore';
import { useEffect } from 'react';

export default function SafetyAlerts({ version }: { version: FormulaVersion }) {
  const { evaluate, alerts } = useSafetyStore();
  const list = alerts[version.id] || [];

  useEffect(() => { evaluate(version); }, [version, evaluate]);

  if (!list.length) return null;
  return (
    <div className="panel" style={{border:'1px solid var(--warn)'}}>
      <h3>Sécurité</h3>
      <ul>
        {list.map(a => (
          <li key={a.rule.id} style={{color: a.rule.severity === 'block' ? 'var(--danger)' : 'var(--warn)'}}>
            {a.rule.message} {a.current != null && `(${a.current.toFixed(2)}%)`}
          </li>
        ))}
      </ul>
    </div>
  );
}