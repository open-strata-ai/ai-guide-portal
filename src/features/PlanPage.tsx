import React, { useEffect, useState } from 'react';
import { Button, Spin, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PreviewCalc } from '../components/PreviewCalc';
import { useAssemblyStore } from '../application/assembly/assemblyStore';
import { usePreviewCalc } from '../application/preview/usePreviewCalc';
import { guideApi } from '../infrastructure/guideApiClient';

/** Dependency expansion + change preview (DESIGN §2 / §13.3). */
export function PlanPage() {
  const { selections, profile, setPlan } = useAssemblyStore();
  const [enabled, setEnabled] = useState<string[]>(['chat', 'modelProvider']);
  const [loading, setLoading] = useState(false);
  const plan = usePreviewCalc({ selections: selections as any, enabled: enabled as any });
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    guideApi
      .preview(selections, profile)
      .then((p) => !cancelled && setPlan(p))
      .catch(() => undefined)
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [selections, profile, setPlan]);

  return (
    <div>
      <Typography.Title level={4}>Change preview</Typography.Title>
      <Spin spinning={loading}>
        <PreviewCalc plan={plan} />
      </Spin>
      <Button
        type="primary"
        style={{ marginTop: 16 }}
        disabled={selections.length === 0}
        onClick={() => navigate('/apply')}
      >
        Next: apply
      </Button>
    </div>
  );
}
