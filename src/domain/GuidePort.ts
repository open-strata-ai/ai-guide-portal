import type {
  CapabilityCard,
  DeploymentPlan,
  PlatformManifest,
  RollbackTarget,
} from './types';

/**
 * Port (DESIGN §3 dependency inversion): the application layer depends only on
 * this interface; `infrastructure/guideApiClient.ts` provides the adapter. The
 * Go engine is never called directly by the frontend — all orchestration goes
 * through this portal's Java backend (anti-corrosion layer, §15.5.2).
 */
export interface GuidePort {
  getCapabilities(): Promise<CapabilityCard[]>;
  preview(selections: string[], profile: string): Promise<DeploymentPlan>;
  apply(planId: string): Promise<{ id: string; status: string }>;
  getStatus(): Promise<import('./types').ComponentStatus[]>;
  rollback(target: RollbackTarget): Promise<{ id: string; status: string }>;
  getManifest(): Promise<PlatformManifest>;
}
