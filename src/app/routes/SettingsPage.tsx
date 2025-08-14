import { exportAll, importBundle } from '../../services/exportImport';
import { useState } from 'react';

export function SettingsPage() {
  const [importMode, setImportMode] = useState<'merge'|'replace'>('merge');
  async function handleExport() {
    const bundle = await exportAll();
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `backup-${new Date().toISOString()}.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function handleImport(file: File) {
    const txt = await file.text();
    const json = JSON.parse(txt);
    await importBundle(json, importMode);
    alert('Import terminé.');
  }
  return (
    <div>
      <h1>Paramètres</h1>
      <div className="panel">
        <h3>Export / Backup</h3>
        <button onClick={handleExport}>Exporter toutes les données</button>
      </div>
      <div className="panel">
        <h3>Import</h3>
        <select value={importMode} onChange={e=>setImportMode(e.target.value as any)}>
          <option value="merge">Fusion (conserve existants)</option>
          <option value="replace">Remplacer tout</option>
        </select>
        <input type="file" accept="application/json" onChange={e=>{
          const f = e.target.files?.[0];
          if (f) handleImport(f);
        }} />
      </div>
    </div>
  );
}