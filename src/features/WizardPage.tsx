import React from 'react';
import { Button, Segmented, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CapabilityCatalog } from '../components/CapabilityCatalog';
import { useAssemblyStore } from '../application/assembly/assemblyStore';
import type { Profile } from '../domain/types';

/** Capability Selection Wizard (DESIGN §2 / §13.1). */
export function WizardPage() {
  const { selections, profile, setProfile, toggleSelection } = useAssemblyStore();
  const navigate = useNavigate();
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
