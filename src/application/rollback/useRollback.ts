import { useState } from 'react';
import type { CapabilityId, RollbackTarget } from '../../domain/types';
import { guideApi } from '../../infrastructure/guideApiClient';

/**
 * rollback-ux (ADR-0003) — declarative rollback UX granularity.
 *
 * Open question §11#3: single-component vs whole-manifest rollback. ADR-0003
 * resolves it as: the portal offers BOTH granularities. `granularity:
 * 'component'` rewrites only one capability in the manifest (e.g. disable
 * `rag`); `granularity: 'manifest'` rewinds the entire tenant manifest. This
 * hook drives the rollback confirmation and submits via `GuidePort.rollback`.
 */
export function useRollback() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string; status: string } | null>(null);

  async function rollbackComponent(capability: CapabilityId, enabled: boolean) {
    return submit({ granularity: 'component', capability, enabled });
  }

  async function rollbackManifest() {
    return submit({ granularity: 'manifest', enabled: false });
  }

  async function submit(target: RollbackTarget) {
    setSubmitting(true);
    try {
      const res = await guideApi.rollback(target);
      setResult(res);
      return res;
    } finally {
      setSubmitting(false);
    }
  }

  return { submitting, result, rollbackComponent, rollbackManifest };
}
