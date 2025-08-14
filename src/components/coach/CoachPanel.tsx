import { useEffect } from 'react';
import { useCoachStore } from '../../stores/coachStore';

export default function CoachPanel() {
  const { messages, evaluate, dismiss, act } = useCoachStore();

  useEffect(() => {
    evaluate();
    const id = setInterval(() => evaluate(), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [evaluate]);

  if (!messages.length) return null;
  return (
    <div style={{
      position:'fixed', bottom:20, right:20, width:320,
      background:'#1e2530', border:'1px solid #314255', borderRadius:8, padding:'0.5rem'
    }}>
      <h4 style={{margin:'0 0 0.5rem 0'}}>Coach</h4>
      {messages.map(m => (
        <div key={m.id} style={{marginBottom:'0.5rem', background:'#242c37', padding:'0.5rem', borderRadius:6}}>
          <div style={{fontSize:14}}>{m.message}</div>
          <div style={{display:'flex', gap:8, marginTop:4}}>
            {m.cta && <button onClick={()=>act(m.cta!.action)}>{m.cta.label}</button>}
            <button className="secondary" onClick={()=>dismiss(m.id)}>Fermer</button>
          </div>
        </div>
      ))}
    </div>
  );
}