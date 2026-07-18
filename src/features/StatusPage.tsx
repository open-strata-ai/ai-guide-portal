import React, { useEffect, useState } from 'react';
import { Tag, Typography } from 'antd';
import { DataTable, type DataTableColumn } from '@openstrata/ai-ui-kit';
import { guideApi } from '../infrastructure/guideApiClient';
import { getLabel } from '../domain/capabilityCatalog';
import type { ComponentStatus } from '../domain/types';

/** Status dashboard (DESIGN §2 / §13.1). */
export function StatusPage() {
  const [data, setData] = useState<ComponentStatus[]>([]);
  useEffect(() => {
    let cancelled = false;
    guideApi
      .getStatus()
      .then((d) => !cancelled && setData(d))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const columns: DataTableColumn<ComponentStatus>[] = [
    { key: 'label', title: 'Component', sortable: true },
    {
      key: 'health',
      title: 'Health',
      render: (v) => <Tag color={v === 'ready' ? 'green' : v === 'failed' ? 'red' : 'blue'}>{String(v)}</Tag>,
    },
    {
      key: 'quota',
      title: 'Quota (cpu/token/qps/vector)',
      render: (v) => {
        const q = v as ComponentStatus['quota'];
        return `${q.cpu}/${q.token}/${q.qps}/${q.vector}`;
      },
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>Deployment status</Typography.Title>
      <DataTable data={data} columns={columns} rowKey="id" pagination={false} density="compact" />
      {data.length === 0 && (
        <Typography.Text type="secondary">
          No live status yet — apply an upgrade to populate the board.
        </Typography.Text>
      )}
      <span style={{ display: 'none' }}>{getLabel('chat')}</span>
    </div>
  );
}
