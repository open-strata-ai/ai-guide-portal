import React from 'react';
import { Card, Checkbox, Tag, Typography } from 'antd';
import type { CapabilityCard as CardModel } from '../domain/types';

/**
 * CapabilityCard — business-language selection card (DESIGN §13.2). NOTE: this
 * is a portal-local card; ai-ui-kit does not ship a CapabilityCard, so we build
 * it here and keep it readonly-editable. Restricted capabilities (outside the
 * tenant whitelist) are greyed-out and labelled (DESIGN §7.2).
 */
export function CapabilityCard({
  card,
  checked,
  onToggle,
}: {
  card: CardModel;
  checked: boolean;
  onToggle: (id: CardModel['id']) => void;
}) {
  return (
    <Card
      size="small"
      style={{
        opacity: card.restricted ? 0.5 : 1,
        borderColor: checked ? '#1677ff' : undefined,
      }}
      title={card.label}
      extra={
        card.restricted ? (
          <Tag color="default">Needs platform-admin</Tag>
        ) : (
          <Checkbox
            checked={checked}
            aria-pressed={checked}
            onChange={() => onToggle(card.id)}
          />
        )
      }
    >
      <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
        {card.description}
      </Typography.Paragraph>
      {card.dependsOn.length > 0 && (
        <Tag color="blue">deps: {card.dependsOn.join(', ')}</Tag>
      )}
    </Card>
  );
}
