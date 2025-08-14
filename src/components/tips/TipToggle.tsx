import { useTipStore } from '../../stores/tipStore';

export default function TipToggle() {
  const { enabled, toggle } = useTipStore();
  return (
    <button type="button" className="secondary" onClick={toggle}>
      {enabled ? 'Désactiver tips' : 'Activer tips'}
    </button>
  );
}