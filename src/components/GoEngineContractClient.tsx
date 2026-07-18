import React from 'react';
import { Alert, Descriptions, Tag } from 'antd';
import {
  buildContractStatus,
  type GoEngineContractStatus,
} from '../infrastructure/goEngineClient';

/**
 * go-engine-contract-client (R-004) — surfaces the Go engine interface versions
 * pinned in bom.yaml. In production the backend reports the versions it
 * negotiated; here we show the expected (pinned) contract and validate any
 * reported mismatch. Single SemVer source of truth — never diverges.
 */
export function GoEngineContractClient({
  reported = null,
}: {
  reported?: GoEngineContractStatus['reported'];
}) {
  const status = buildContractStatus(reported);
  return (
    <div>
      <Alert
        type={status.allOk ? 'success' : 'warning'}
        showIcon
        message={
          status.allOk
            ? 'Go engine contract matches pinned bom.yaml interface_versions (R-004)'
            : 'Interface version mismatch vs bom.yaml'
        }
      />
      <Descriptions bordered column={3} size="small" style={{ marginTop: 12 }}>
        {status.reports.map((r) => (
          <Descriptions.Item key={r.interfaceName} label={r.interfaceName}>
            <Tag color={r.ok ? 'green' : 'red'}>{r.expected}</Tag>
            {r.reported ? ` (reported ${r.reported})` : ' (unreported)'}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </div>
  );
}
