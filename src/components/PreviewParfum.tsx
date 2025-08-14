
export function PreviewParfum({ name, ingredients, iaEval }: {
  name: string;
  ingredients: Array<{ name: string; percent: number; noteLevel?: string }>;
  iaEval?: { longivite: number; qualite: number; senteur: string };
}) {
  return (
    <div style={{background:'#fffbe6', border:'1px solid #e0c97a', borderRadius:12, padding:'1.5rem', margin:'1rem 0', boxShadow:'0 2px 8px #0001'}}>
      <h2 style={{color:'#bfa14a'}}>{name}</h2>
      <div style={{display:'flex', gap:'2rem', flexWrap:'wrap'}}>
        <div>
          <b>Ingrédients :</b>
          <ul>
            {ingredients.map((ing, i) => (
              <li key={i} style={{color:ing.noteLevel==='top'?'#0f766e':ing.noteLevel==='heart'?'#eab308':'#7c3aed'}}>
                {ing.name} <span style={{fontWeight:'bold'}}>{ing.percent}%</span> <span style={{fontSize:'0.9em'}}>{ing.noteLevel}</span>
              </li>
            ))}
          </ul>
        </div>
        {iaEval && (
          <div>
            <b>Analyse IA :</b>
            <div>Longévité : <b>{iaEval.longivite}/100</b></div>
            <div>Qualité : <b>{iaEval.qualite}/100</b></div>
            <div>Senteur : <b>{iaEval.senteur}</b></div>
          </div>
        )}
      </div>
    </div>
  );
}
