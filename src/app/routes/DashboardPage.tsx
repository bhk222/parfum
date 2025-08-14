import { useEffect, useMemo, useState } from 'react';
import { useInventoryStore } from '../../stores/inventoryStore';
import { useFormulaStore } from '../../stores/formulaStore';
import { daysSinceLastBackup } from '../../services/backupService';
import { exportAll } from '../../services/exportImport';
import { recordBackup } from '../../services/backupService';
import { FamilyChart } from '../../components/charts/FamilyChart';

export function DashboardPage() {
  const { ingredients, load: loadInv } = useInventoryStore();
  const { formulas, loadFormulas } = useFormulaStore();
  const [lastBackupDays, setLastBackupDays] = useState<number | undefined>();

  useEffect(() => { loadInv(); loadFormulas(); }, [loadInv, loadFormulas]);
  useEffect(() => { daysSinceLastBackup().then(setLastBackupDays); }, []);

  const familiesCount = useMemo(() => {
    const map = new Map<string, number>();
    ingredients.forEach(i => map.set(i.family, (map.get(i.family) ?? 0) + 1));
    return [...map.entries()];
  }, [ingredients]);

  async function quickBackup() {
    const bundle = await exportAll();
    await recordBackup(bundle.hash);
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `backup-${new Date().toISOString()}.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    daysSinceLastBackup().then(setLastBackupDays);
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ flex:'1 1 320px' }}>
          <div className="panel">
            <h3>Inventaire</h3>
            <p>{ingredients.length} ingrédients</p>
            <ul>
              {familiesCount.map(([fam, n]) => <li key={fam}>{fam || '(sans)'} : {n}</li>)}
            </ul>
          </div>
          <div className="panel">
            <h3>Formules</h3>
            <p>{formulas.length} formules</p>
          </div>
          <div className="panel">
            <h3>Backup</h3>
            <p>Dernier backup: {lastBackupDays == null ? 'Jamais' : `${lastBackupDays.toFixed(1)} jours`}</p>
            {(lastBackupDays == null || lastBackupDays > 7) && (
              <p style={{color:'var(--warn)'}}>Aucun backup récent.</p>
            )}
            <button onClick={quickBackup}>Backup rapide</button>
          </div>
          <div className="panel">
            <h3>Prochaines étapes</h3>
            <ul>
              <li>Faire des évaluations sur les nouvelles formules</li>
              <li>Utiliser les suggestions pour ajuster</li>
              <li>Surveiller les alertes sécurité</li>
            </ul>
          </div>
        </div>
        <div style={{ flex:'1 1 480px' }}>
          <FamilyChart ingredients={ingredients} />
        </div>
      </div>
    </div>
  );
}