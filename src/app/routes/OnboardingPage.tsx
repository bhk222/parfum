import OnboardingWizard from '../../components/wizard/OnboardingWizard';
import { useInventoryStore } from '../../stores/inventoryStore';
import { useEffect } from 'react';

export function OnboardingPage() {
  const { load } = useInventoryStore();
  useEffect(() => { load(); }, [load]);
  return (
    <div>
      <h1>Onboarding</h1>
      <OnboardingWizard />
    </div>
  );
}