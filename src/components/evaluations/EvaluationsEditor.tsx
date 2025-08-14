import { useState, useEffect } from 'react';
import { useEvaluationStore } from '../../stores/evaluationStore';
import { useReminderStore } from '../../stores/reminderStore';

interface Props {
  formulaVersionId: string;
}

const defaultTimePoints = ['0h','1h','24h','168h'];

export default function EvaluationsEditor({ formulaVersionId }: Props) {
  const { evaluations, load, add } = useEvaluationStore();
  const { byVersion, load: loadReminders, schedule } = useReminderStore();
  const list = evaluations[formulaVersionId] || [];
  const reminders = byVersion[formulaVersionId] || [];
  const [attrs, setAttrs] = useState({ ouverture: 0.5, coeur: 0.5, fond: 0.5, tenue: 0.5, satisfaction: 0.5 });
  const [timePoint, setTimePoint] = useState('0h');
  const [comment, setComment] = useState('');

  useEffect(() => {
    load(formulaVersionId);
    loadReminders(formulaVersionId);
  }, [formulaVersionId, load, loadReminders]);

  function slider(name: keyof typeof attrs) {
    return (
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <label style={{width:110}}>{name}</label>
        <input type="range" min={0} max={1} step={0.05}
          value={attrs[name]} onChange={e=>setAttrs(a=>({...a,[name]:Number(e.target.value)}))} />
        <span>{(attrs[name]*100).toFixed(0)}</span>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>Évaluations</h3>
      <form onSubmit={e=>{
        e.preventDefault();
        add({
          formulaVersionId,
          timePoint,
            attributes: attrs,
          comment
        }).then(()=>{
          setComment('');
        });
      }}>
        <div className="flex" style={{flexWrap:'wrap'}}>
          <select value={timePoint} onChange={e=>setTimePoint(e.target.value)}>
            {defaultTimePoints.map(tp => <option key={tp}>{tp}</option>)}
          </select>
          <input placeholder="Commentaire" value={comment} onChange={e=>setComment(e.target.value)} style={{flex:1}} />
          <button type="submit">Enregistrer</button>
        </div>
        <div style={{display:'grid', gap:4, marginTop:8}}>
          {slider('ouverture')}
          {slider('coeur')}
          {slider('fond')}
          {slider('tenue')}
          {slider('satisfaction')}
        </div>
      </form>
      <h4 style={{marginTop:'1rem'}}>Historique ({list.length})</h4>
      <ul>
        {list.map(ev => (
          <li key={ev.id}>
            {ev.timePoint} - {(ev.attributes.satisfaction ?? 0)*100 | 0}% sat.
            {ev.comment && <> — {ev.comment}</>}
          </li>
        ))}
      </ul>
      <h4>Rappels</h4>
      <div className="flex">
        {defaultTimePoints.map(tp => (
          <button key={tp} type="button" className="secondary" onClick={()=>{
            const now = Date.now();
            let offset = 0;
            if (tp === '1h') offset = 3600000;
            if (tp === '24h') offset = 24*3600000;
            if (tp === '168h') offset = 168*3600000;
            schedule({ targetType:'evaluation', targetId: formulaVersionId, scheduleAt: now + offset });
          }}>{tp}</button>
        ))}
      </div>
      <ul>
        {reminders.filter(r => r.status === 'pending').map(r => (
          <li key={r.id}>Rappel {new Date(r.scheduleAt).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}