import React from 'react';
import { Alert, Descriptions, Empty, Tag, Typography } from 'antd';
import { getLabel } from '../domain/capabilityCatalog';
import type { DeploymentPlan } from '../domain/types';

/**
 * preview-calc (ADR-0002) — renders the reuse-M calculation result: which
 * components are New vs Reused vs dropped, plus the dependency graph summary.
 * "Reuse M" = components already enabled in the tenant (see usePreviewCalc).
 */
export function PreviewCalc({ plan }: { plan: DeploymentPlan | null }) {
  if (!plan) {
    return <Empty description="Select capabilities to preview the plan" />;
  }
  const m = plan.reuse.length;
  return (
    <div>
      <Descriptions bordered column={3} size="small">
        <Descriptions.Item label="New">{plan.add.length}</Descriptions.Item>
        <Descriptions.Item label="Reuse (M)">
          <Tag color="green">{m}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Drop">{plan.drop.length}</Descriptions.Item>
        <Descriptions.Item label="Downtime">{plan.downtime}</Descriptions.Item>
        <Descriptions.Item label="Graph nodes">{plan.graph.length}</Descriptions.Item>
      </Descriptions>

      <Typography.Paragraph style={{ marginTop: 12 }}>
        <b>New:</b> {plan.add.map(getLabel).join(', ') || '—'}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <b>Reused:</b> {plan.reuse.map(getLabel).join(', ') || '—'}
      </Typography.Paragraph>
      {plan.drop.length > 0 && (
        <Alert
          type="warning"
          showIcon
          message={`Will take offline: ${plan.drop.map(getLabel).join(', ')}`}
        />
      )}
    </div>
  );
}
