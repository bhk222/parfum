import { useEffect, useState } from 'react';
import { useFormulaStore } from '../../stores/formulaStore';
import { useInventoryStore } from '../../stores/inventoryStore';
import { Link } from 'react-router-dom';
import AssistantParfum from '../../components/AssistantParfum';

export function FormulasPage() {
  const { formulas, loadFormulas, create } = useFormulaStore();
  const { ingredients, load: loadInv } = useInventoryStore();
  const [name, setName] = useState('');
  const [selection, setSelection] = useState<{ingredientId:string; percent:number}[]>([]);

  useEffect(() => {
    loadFormulas();
    loadInv();
    // Ajout automatique de la formule d’essai si absente
    setTimeout(() => {
      if (!formulas.some(f => f.name === 'Fraîcheur aromatique boisée') && ingredients.length) {
        const getId = (name: string) => {
          const ing = ingredients.find(i => i.name === name);
          return ing ? ing.id : '';
        };
        create('Fraîcheur aromatique boisée', [
          { ingredientId: getId('Romarin'), percent: 20 },
          { ingredientId: getId('Cyprès'), percent: 15 },
          { ingredientId: getId('Zeste de citron'), percent: 10 },
          { ingredientId: getId('Menthe poivrée'), percent: 10 },
          { ingredientId: getId('Ylang-ylang'), percent: 10 },
          { ingredientId: getId('Eucalyptus'), percent: 10 },
          { ingredientId: getId('Oliban'), percent: 5 },
          { ingredientId: '', percent: 20 } // Base neutre
        ]);
      }
    }, 1000);
  }, [loadFormulas, loadInv, formulas, ingredients, create]);

  function addLine() {
    if (!ingredients.length) return;
    setSelection(s => [...s, { ingredientId: ingredients[0].id, percent: 5 }]);
  }

  const total = selection.reduce((a,b)=>a + b.percent, 0);

  return (
    <div>
      <h1>Formules</h1>
      <div className="panel">
        <h3>Créer une formule</h3>
        <input placeholder="Nom" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={addLine} type="button">+ ingrédient</button>
        {selection.map((line, idx) => (
          <div key={idx} className="flex">
            <select value={line.ingredientId} onChange={e=>{
              const v = e.target.value;
              setSelection(sel => sel.map((l,i)=> i===idx ? {...l, ingredientId:v} : l));
            }}>
              {ingredients.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
            <input type="number" value={line.percent} onChange={e=>{
              const v = Number(e.target.value);
              setSelection(sel=>sel.map((l,i)=> i===idx ? {...l, percent:v} : l));
            }} style={{width:80}} />
            <button className="secondary" onClick={()=>{
              setSelection(sel => sel.filter((_,i)=>i!==idx));
            }}>X</button>
          </div>
        ))}
        <div>Total: {total}% (idéal 100%)</div>
        <button disabled={!name || !selection.length || total === 0} onClick={()=>{
          create(name, selection).then(()=>{
            setName(''); setSelection([]);
          });
        }}>Enregistrer</button>
        <div style={{marginTop:'2rem', background:'#f7f7e6', padding:'1rem', borderRadius:8}}>
          <h4>Suggestion IA inspirée d’un parfum connu</h4>
          <input id="parfumRef" placeholder="Nom du parfum (ex: Eau Sauvage)" style={{width:'60%'}} />
          <button type="button" onClick={()=>{
            const ref = (document.getElementById('parfumRef') as HTMLInputElement).value.trim().toLowerCase();
            // Exemples simplifiés
            let base: Array<{name:string, percent:number}> = [];
            if(ref.includes('eau sauvage')) base = [
              {name:'Zeste de citron',percent:20},{name:'Romarin',percent:15},{name:'Menthe poivrée',percent:10},{name:'Cyprès',percent:10},{name:'Ylang-ylang',percent:10},{name:'Eucalyptus',percent:10},{name:'Oliban',percent:5}
            ];
            if(ref.includes('chanel')||ref.includes('n°5')) base = [
              {name:'Ylang-ylang',percent:20},{name:'Zeste de citron',percent:10},{name:'Romarin',percent:10},{name:'Oliban',percent:10}
            ];
            if(ref.includes('torino21')) base = [
              {name:'Menthe poivrée',percent:20},{name:'Zeste de citron',percent:15},{name:'Romarin',percent:15},{name:'Cyprès',percent:10},{name:'Ylang-ylang',percent:10},{name:'Eucalyptus',percent:10},{name:'Oliban',percent:5}
            ];
            if(!base.length) {
              alert('Parfum non reconnu ou non supporté.');
              return;
            }
            // Adapter à l’inventaire
            const sel = base.filter(b => ingredients.some(i => i.name === b.name)).map(b => {
              const ing = ingredients.find(i => i.name === b.name);
              return ing ? { ingredientId: ing.id, percent: b.percent } : null;
            }).filter(Boolean) as { ingredientId: string; percent: number }[];
            setName('Essai inspiré de ' + ref);
            setSelection(sel);
          }}>Générer la formule</button>
        </div>
      </div>
  <AssistantParfum />
      <div className="panel">
        <h3>Liste formules</h3>
        <ul>
          {formulas.map(f => (
            <li key={f.id}>
              <Link to={`/formulas/${f.id}`}>{f.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}