import React, { useEffect } from 'react';
import { Button, Segmented, Space, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CapabilityCatalog } from '../components/CapabilityCatalog';
import { useAssemblyStore } from '../application/assembly/assemblyStore';
import type { Profile } from '../domain/types';

/** Capability Selection Wizard (DESIGN §2 / §13.1). */
export function WizardPage() {
  const { selections, profile, setProfile, toggleSelection } = useAssemblyStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // RC-7: honor a ?profile= deep link (e.g. Home "Start with a Chat Agent").
  // RC-6: if no modules are selected yet, materialize the current profile's
  // default modules so the wizard is never empty and "Next" is enabled.
  useEffect(() => {
    const deepLink = params.get('profile') as Profile | null;
    if (deepLink) {
      setProfile(deepLink);
    } else if (useAssemblyStore.getState().selections.length === 0) {
      setProfile(profile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Typography.Text>Profile:</Typography.Text>
        <Segmented
          value={profile}
          onChange={(v) => setProfile(v as Profile)}
          options={['starter', 'standard', 'advanced', 'full']}
        />
      </Space>
      <CapabilityCatalog selected={selections} onToggle={toggleSelection} />
      <Button
        type="primary"
        style={{ marginTop: 16 }}
        disabled={selections.length === 0}
        onClick={() => navigate('/plan')}
      >
        Next: preview plan
      </Button>
    </div>
  );
}
