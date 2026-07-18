import React from 'react';
import { Card, Typography } from 'antd';
import { RollbackUx } from '../components/RollbackUx';

/** Rollback & safety (DESIGN §2 / §13.5). */
export function RollbackPage() {
  return (
    <Card title="Declarative rollback">
      <Typography.Paragraph type="secondary">
        Rewind the tenant manifest or disable a single capability (ADR-0003).
      </Typography.Paragraph>
      <RollbackUx />
    </Card>
  );
}
