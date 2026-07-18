import React from 'react';
import { Card, Typography } from 'antd';
import { GoEngineContractClient } from '../components/GoEngineContractClient';

/** Go engine contract view (R-004) — pinned bom.yaml interface versions. */
export function ContractPage() {
  return (
    <Card title="Go engine contract (R-004)">
      <Typography.Paragraph type="secondary">
        Interface versions are pinned in openstrata-meta/bom.yaml and are the
        single SemVer source of truth for the Java backend ↔ Go engine contract.
      </Typography.Paragraph>
      <GoEngineContractClient />
    </Card>
  );
}
