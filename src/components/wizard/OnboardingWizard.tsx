import { useState } from 'react';
import { useInventoryStore } from '../../stores/inventoryStore';
import { useFormulaStore } from '../../stores/formulaStore';

const sampleIngredients = [
  { name: 'Citron', family:'citrus', noteLevel:'top', volatilityScore:0.9 },
  { name: 'Lavande', family:'floral', noteLevel:'heart', volatilityScore:0.6 },
  { name: 'Patchouli', family:'woody', noteLevel:'base', volatilityScore:0.2 },
  { name: 'Ylang', family:'floral', noteLevel:'heart', volatilityScore:0.5 }
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState('fr');
  const { ingredients, add } = useInventoryStore();
  const { create } = useFormulaStore();
  const [selected, setSelected] = useState<number[]>([]);
  const [createdFormulaId, setCreatedFormulaId] = useState<string | null>(null);

  const steps = [
    'Langue',
    'Ingrédients rapides',
    'Première formule (optionnel)',
    'Terminé'
  ];

  return (
    <div className="panel">
      <h2>Onboarding</h2>
      <p>Étape {step+1}/{steps.length} — {steps[step]}</p>
      {step === 0 && (
        <div>
          <label>Langue:
            <select value={lang} onChange={e=>setLang(e.target.value)}>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </label>
          <p>Cette préférence peut être changée plus tard.</p>
          <button onClick={()=>setStep(1)}>Suivant</button>
        </div>
      )}
      {step === 1 && (
        <div>
          <p>Sélectionne des ingrédients présents dans ton inventaire réel.</p>
          <ul style={{display:'flex', flexWrap:'wrap', gap:8, padding:0, listStyle:'none'}}>
            {sampleIngredients.map((ing, idx) => {
              const active = selected.includes(idx);
              return (
                <li key={idx}>
                  <button type="button" className={active ? '' : 'secondary'} onClick={()=>{
                    setSelected(sel => sel.includes(idx) ? sel.filter(i=>i!==idx) : [...sel, idx]);
                  }}>{ing.name}</button>
                </li>
              );
            })}
          </ul>
          <button onClick={async ()=>{
            for (const idx of selected) {
              const s = sampleIngredients[idx];
              await add({
                ...s,
                maxDilution: undefined,
                safetyFlags: [],
                density: undefined,
                createdAt:0, updatedAt:0
              } as any);
            }
            setStep(2);
          }} disabled={!selected.length}>Ajouter ({selected.length}) et continuer</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <p>Créer une première formule basique optionnelle.</p>
          <button onClick={async ()=>{
            if (ingredients.length < 2) {
              setStep(3);
              return;
            }
            const items = ingredients.slice(0, Math.min(3, ingredients.length)).map(ing => ({
              ingredientId: ing.id,
              percent: (100 / Math.min(3, ingredients.length))
            }));
            const res = await create('Formule Démo', items);
            setCreatedFormulaId(res ?? null);
            setStep(3);
          }}>Générer une formule exemple</button>
          <button className="secondary" onClick={()=>setStep(3)}>Passer</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h3>Prêt !</h3>
          <p>Inventaire actuel: {ingredients.length} ingrédients. {createdFormulaId && 'Une formule exemple a été créée.'}</p>
          <button onClick={()=>location.href='/'}>Aller au Dashboard</button>
        </div>
      )}
    </div>
  );
}