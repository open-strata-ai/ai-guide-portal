import React, { useMemo } from 'react';
import { Empty, Space, Typography } from 'antd';
import { DataTable, type DataTableColumn } from '@openstrata/ai-ui-kit';
import { CAPABILITY_CATALOG, getLabel } from '../domain/capabilityCatalog';
import { CapabilityCard } from './CapabilityCard';
import type { CapabilityId } from '../domain/types';

/**
 * capability-catalog (ADR-0001) — single source of truth rendered as both a
 * card grid (wizard) and a `DataTable` (admin/audit view). The catalog itself
 * lives in `domain/capabilityCatalog.ts`; this component only renders it.
 */
export function CapabilityCatalog({
  selected,
  onToggle,
  layout = 'cards',
}: {
  selected: CapabilityId[];
  onToggle: (id: CapabilityId) => void;
  layout?: 'cards' | 'table';
}) {
  if (layout === 'table') {
    const columns: DataTableColumn<(typeof CAPABILITY_CATALOG)[number]>[] = [
      { key: 'label', title: 'Capability', sortable: true },
      { key: 'description', title: 'Description' },
      {
        key: 'dependsOn',
        title: 'Depends on',
        render: (v) => (v as CapabilityId[]).join(', ') || '—',
      },
      {
        key: 'enabledByDefault',
        title: 'Default',
        render: (v) => ((v as boolean) ? 'yes' : 'no'),
      },
    ];
    return (
      <DataTable
        data={CAPABILITY_CATALOG}
        columns={columns}
        rowKey="id"
        pagination={false}
        density="compact"
      />
    );
  }

  if (CAPABILITY_CATALOG.length === 0) {
    return <Empty description="No capabilities" />;
  }

  const cards = useMemo(
    () =>
      CAPABILITY_CATALOG.map((c) => (
        <CapabilityCard
          key={c.id}
          card={c}
          checked={selected.includes(c.id)}
          onToggle={onToggle}
        />
      )),
    [selected, onToggle],
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Text type="secondary">
        {selected.length} selected · {getLabel('chat')} is the default entry point
      </Typography.Text>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12,
        }}
      >
        {cards}
      </div>
    </Space>
  );
}
