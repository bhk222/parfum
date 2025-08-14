import { useParams } from 'react-router-dom';
import { useFormulaStore } from '../../stores/formulaStore';
import { useEffect } from 'react';
import EvaluationsEditor from '../../components/evaluations/EvaluationsEditor';
import { useEvaluationStore } from '../../stores/evaluationStore';
import { EvaluationChart } from '../../components/charts/EvaluationChart';

export function EvaluationsPage() {
  const { id } = useParams();
  const { loadVersions, versions } = useFormulaStore();
  const { evaluations } = useEvaluationStore();

  useEffect(() => { if (id) loadVersions(id); }, [id, loadVersions]);
  const vs = id ? versions[id] ?? [] : [];
  const last = vs[vs.length - 1];

  if (!id) return <p>ID formule manquant.</p>;
  if (!last) return <p>Aucune version pour cette formule.</p>;

  const evals = evaluations[last.id] || [];

  return (
    <div>
      <h1>Évaluations formule</h1>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ flex:'1 1 480px', minWidth:320 }}>
          <EvaluationsEditor formulaVersionId={last.id} />
        </div>
        <div style={{ flex:'1 1 560px', minWidth:360 }}>
          <EvaluationChart evaluations={evals} />
        </div>
      </div>
    </div>
  );
}