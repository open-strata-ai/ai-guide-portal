import React from 'react';
import { Steps } from 'antd';
import { MermaidRenderer } from '@openstrata/ai-ui-kit';
import { useCanaryDisplay } from '../application/canary/useCanaryDisplay';

/**
 * grayscale-upgrade-display (ADR-0004) — shows the canary three-stage state
 * (dual-write → verifying → cutover) for high-impact switches, with a Mermaid
 * flow of the dual-write/verify/cutover/rollback path.
 */
export function CanaryDisplay({ applyStatus }: { applyStatus: string }) {
  const { phases, mermaid } = useCanaryDisplay(applyStatus);
  const current = phases.findIndex((p) => p.active);
  return (
    <div>
      <Steps
        current={current < 0 ? phases.length : current}
        items={phases.map((p) => ({
          title: p.label,
          status: p.done ? 'finish' : p.active ? 'process' : 'wait',
        }))}
      />
      <div style={{ marginTop: 16 }}>
        <MermaidRenderer code={mermaid} />
      </div>
    </div>
  );
}
