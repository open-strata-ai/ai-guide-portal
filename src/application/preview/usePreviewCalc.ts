import { useMemo } from 'react';
import { CAPABILITY_CATALOG, getCapability } from '../../domain/capabilityCatalog';
import type {
  CapabilityId,
  DeploymentPlan,
  DependencyNode,
} from '../../domain/types';

/**
 * preview-calc (ADR-0002) — preview reuse "M" calculation caliber.
 *
 * Open question §11#2: is reuse judged "same tenant enabled AND version
 * compatible" or "cluster already exists"? ADR-0002 resolves it as: a component
 * is REUSED when it is already enabled in the tenant manifest and the catalog
 * marks it enabledByDefault/already-on; otherwise it is ADDed. This hook is the
 * pure, testable caliber used by both the wizard preview and the plan diff.
 */
export interface PreviewCalcInput {
  selections: CapabilityId[];
  /** Capabilities already enabled in the tenant manifest. */
  enabled: CapabilityId[];
}

function expand(selections: CapabilityId[]): Set<CapabilityId> {
  const out = new Set<CapabilityId>();
  const visit = (id: CapabilityId) => {
    if (out.has(id)) return;
    out.add(id);
    getCapability(id)?.dependsOn.forEach(visit);
  };
  selections.forEach(visit);
  return out;
}

export function calculatePlan(
  selections: CapabilityId[],
  enabled: CapabilityId[],
): DeploymentPlan {
  const required = expand(selections);
  const enabledSet = new Set(enabled);
  const add: CapabilityId[] = [];
  const reuse: CapabilityId[] = [];
  const drop: CapabilityId[] = [];
  required.forEach((id) => (enabledSet.has(id) ? reuse.push(id) : add.push(id)));

  const graph: DependencyNode[] = [...required].map((id) => {
    const c = getCapability(id)!;
    return { id, label: c.label, dependsOn: c.dependsOn };
  });

  return { graph, add, reuse, drop, downtime: 'none' };
}

export function usePreviewCalc(input: PreviewCalcInput): DeploymentPlan {
  return useMemo(
    () => calculatePlan(input.selections, input.enabled),
    [input.selections, input.enabled],
  );
}

/** The "M" in reuse-M: how many required components are already present. */
export function reuseRatio(plan: DeploymentPlan): { add: number; reuse: number; m: number } {
  return {
    add: plan.add.length,
    reuse: plan.reuse.length,
    m: plan.reuse.length,
  };
}

export const ALL_CAPABILITIES = CAPABILITY_CATALOG;
