import React, { useState } from 'react';
import { Button, Steps, Typography } from 'antd';
import { CanaryDisplay } from '../components/CanaryDisplay';
import { useAssemblyStore } from '../application/assembly/assemblyStore';
import { guideApi } from '../infrastructure/guideApiClient';

/** One-click execution (DESIGN §2 / §13.3 / §13.5). */
export function ApplyPage() {
  const { plan, applyStatus, setApplyStatus } = useAssemblyStore();
  // Use the real plan id returned by the preview step so the backend can find
  // and apply the persisted plan (fall back to a synthetic id only if the user
  // lands on /apply directly without previewing first).
  const planId = plan?.id ?? 'plan-' + Date.now();

  async function apply() {
    setApplyStatus('validating');
    try {
      const res = await guideApi.apply(planId);
      setApplyStatus(res.status === 'APPLIED' ? 'applying' : 'ready');
    } catch {
      setApplyStatus('failed');
    }
  }

  return (
    <div>
      <Typography.Title level={4}>Apply upgrade</Typography.Title>
      <Steps
        current={applyStatus === 'idle' ? 0 : 1}
        items={[
          { title: 'Validate', status: 'finish' },
          { title: 'Generate + apply', status: applyStatus === 'failed' ? 'error' : 'process' },
        ]}
      />
      <CanaryDisplay applyStatus={applyStatus} />
      <Button
        type="primary"
        style={{ marginTop: 16 }}
        disabled={!plan}
        onClick={apply}
      >
        Confirm & apply
      </Button>
    </div>
  );
}
