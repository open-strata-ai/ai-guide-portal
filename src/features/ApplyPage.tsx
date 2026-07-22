import React, { useState } from 'react';
import { Alert, Button, Steps, Typography } from 'antd';
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
    setApplyStatus('applying');
    try {
      const res = await guideApi.apply(planId);
      // Backend returns APPLIED on a successful apply; reflect that as the
      // terminal "ready" state so the user sees a real result (RC-8).
      setApplyStatus(res.status === 'APPLIED' ? 'ready' : 'failed');
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
      {applyStatus === 'ready' && (
        <Alert
          type="success"
          showIcon
          style={{ marginTop: 16 }}
          message="Plan applied — platform is ready."
        />
      )}
      {applyStatus === 'failed' && (
        <Alert
          type="error"
          showIcon
          style={{ marginTop: 16 }}
          message="Apply failed. Check the backend and retry."
        />
      )}
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
