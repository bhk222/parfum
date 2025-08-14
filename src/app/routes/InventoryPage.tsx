import { useEffect, useState } from 'react';
import { NoteLevel } from '../../models/types';
import { useInventoryStore } from '../../stores/inventoryStore';

export function InventoryPage() {
  const { ingredients, load, add, remove } = useInventoryStore();
  const [form, setForm] = useState({
    name: '', family: '', noteLevel: 'top', volatilityScore: 0.8
  });

  useEffect(() => {
    load();
    // Ajout automatique des ingrédients experts si absents
    const expertIngredients = [
  { name: 'Romarin', family: 'Aromatique', noteLevel: 'top' as NoteLevel, volatilityScore: 0.8 },
  { name: 'Cyprès', family: 'Boisé', noteLevel: 'heart' as NoteLevel, volatilityScore: 0.6 },
  { name: 'Zeste de citron', family: 'Agrume', noteLevel: 'top' as NoteLevel, volatilityScore: 0.9 },
  { name: 'Menthe poivrée', family: 'Aromatique', noteLevel: 'top' as NoteLevel, volatilityScore: 0.85 },
  { name: 'Oliban', family: 'Résineux', noteLevel: 'base' as NoteLevel, volatilityScore: 0.3 },
  { name: 'Eucalyptus', family: 'Aromatique', noteLevel: 'top' as NoteLevel, volatilityScore: 0.8 },
  { name: 'Ylang-ylang', family: 'Florale', noteLevel: 'heart' as NoteLevel, volatilityScore: 0.7 }
    ];
    expertIngredients.forEach(ing => {
      if (!ingredients.some((i: any) => i.name === ing.name)) {
        add({
          name: ing.name,
          family: ing.family,
          noteLevel: ing.noteLevel,
          volatilityScore: ing.volatilityScore
        });
      }
    });
  }, [load, add, ingredients]);

  return (
    <div>
      <h1>Inventaire</h1>
      <div className="panel">
        <h3>Ajouter ingrédient</h3>
        <form onSubmit={e => {
          e.preventDefault();
          if (!form.name) return;
          add({
            name: form.name,
            family: form.family,
            noteLevel: form.noteLevel as NoteLevel,
            volatilityScore: form.volatilityScore
          }).then(() => setForm({ name: '', family: '', noteLevel: 'top', volatilityScore: 0.8 }));
        }}>
          <div className="flex">
            <input placeholder="Nom" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
            <input placeholder="Famille" value={form.family} onChange={e => setForm(f=>({...f,family:e.target.value}))} />
            <select value={form.noteLevel} onChange={e=>setForm(f=>({...f,noteLevel:e.target.value}))}>
              <option value="top">Top</option>
              <option value="heart">Heart</option>
              <option value="base">Base</option>
            </select>
       <input type="number" step="0.05" value={form.volatilityScore}
         onChange={e=>setForm(f=>({...f,volatilityScore:Number(e.target.value)}))} style={{width:90}} />
            <button type="submit">Ajouter</button>
          </div>
        </form>
        <div style={{marginTop:'1rem', fontSize:'0.95rem', color:'#444'}}>
          <b>Convertisseur gouttes / unités de seringue :</b><br />
          <span>1 goutte ≈ 0,05 ml ≈ 5 unités sur une seringue à insuline de 1 ml.</span><br />
          <label>Gouttes : <input type="number" min="0" id="gouttes" onChange={e => {
            const val = Number(e.target.value);
            const res = Math.round(val * 5);
            (document.getElementById('seringue') as HTMLInputElement)!.value = res.toString();
          }} style={{width:60}} /></label>
          <label style={{marginLeft:'1rem'}}>Unités seringue : <input type="number" min="0" id="seringue" onChange={e => {
            const val = Number(e.target.value);
            const res = Math.round(val / 5);
            (document.getElementById('gouttes') as HTMLInputElement)!.value = res.toString();
          }} style={{width:60}} /></label>
        </div>
      </div>
      <div className="panel">
        <h3>Liste ({ingredients.length})</h3>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr><th>Nom</th><th>Famille</th><th>Note</th><th>Volatilité</th><th></th></tr>
          </thead>
          <tbody>
            {ingredients.map(i => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.family}</td>
                <td>{i.noteLevel}</td>
                <td>{i.volatilityScore}</td>
                <td><button className="secondary" onClick={()=>remove(i.id)}>X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}