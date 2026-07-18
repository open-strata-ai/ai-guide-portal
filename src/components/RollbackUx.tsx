import React from 'react';
import { Alert, Radio, Select, Space, Typography } from 'antd';
import { useRollback } from '../application/rollback/useRollback';
import { CAPABILITY_CATALOG } from '../domain/capabilityCatalog';
import type { CapabilityId } from '../domain/types';

/**
 * rollback-ux (ADR-0003) — declarative rollback UI offering both granularities:
 * whole-manifest rollback, or a single-component enable/disable.
 */
export function RollbackUx() {
  const { submitting, result, rollbackComponent, rollbackManifest } = useRollback();
  const [granularity, setGranularity] = React.useState<'manifest' | 'component'>(
    'component',
  );
  const [capability, setCapability] = React.useState<CapabilityId>('rag');

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group
        value={granularity}
        onChange={(e) => setGranularity(e.target.value)}
      >
        <Radio.Button value="component">Per-component</Radio.Button>
        <Radio.Button value="manifest">Whole manifest</Radio.Button>
      </Radio.Group>

      {granularity === 'component' && (
        <Select
          style={{ width: 280 }}
          value={capability}
          onChange={(v) => setCapability(v)}
          options={CAPABILITY_CATALOG.map((c) => ({ value: c.id, label: c.label }))}
        />
      )}

      <Space>
        {granularity === 'component' ? (
          <>
            <a onClick={() => rollbackComponent(capability, false)}>
              Disable {capability}
            </a>
            <a onClick={() => rollbackComponent(capability, true)}>
              Re-enable {capability}
            </a>
          </>
        ) : (
          <a onClick={() => rollbackManifest()}>Rollback entire manifest</a>
        )}
      </Space>

      {submitting && <Typography.Text>Submitting…</Typography.Text>}
      {result && (
        <Alert
          type="success"
          showIcon
          message={`Rollback accepted: ${result.id} (${result.status})`}
        />
      )}
    </Space>
  );
}
