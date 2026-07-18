import { useMemo } from 'react';
import type { CanaryPhase } from '../../domain/types';

/**
 * grayscale-upgrade-display (ADR-0004) — canary upgrade three-stage display.
 *
 * Open question §11#4: how to show the three-stage state "dual-write -> verify
 * -> cutover" for a high-impact switch (e.g. swapping the vector store, DESIGN
 * §13.5 dual-write verification). ADR-0004 resolves it as a single linear
 * phased progress with explicit phase labels and a Mermaid flow. This hook
 * derives the current phase + the mermaid source from an apply status.
 */
export interface CanaryDisplay {
  phase: CanaryPhase;
  phases: { key: CanaryPhase; label: string; done: boolean; active: boolean }[];
  mermaid: string;
}

const ORDER: CanaryPhase[] = ['dual-write', 'verifying', 'cutover'];

export function useCanaryDisplay(applyStatus: string): CanaryDisplay {
  return useMemo(() => {
    const idx =
      applyStatus === 'applying'
        ? 1
        : applyStatus === 'ready'
          ? 2
          : applyStatus === 'failed'
            ? 1
            : 0;
    const phase = ORDER[Math.min(idx, ORDER.length - 1)];
    const phases = ORDER.map((key, i) => ({
      key,
      label:
        key === 'dual-write'
          ? 'Dual-write in progress'
          : key === 'verifying'
            ? 'Verifying'
            : 'Traffic cutover',
      done: i < idx,
      active: i === idx,
    }));
    const mermaid = `flowchart LR
  A[Dual-write] -->|data sync| B(Verifying)
  B -->|checks pass| C[Traffic cutover]
  B -->|checks fail| D[Rollback]`;
    return { phase, phases, mermaid };
  }, [applyStatus]);
}
