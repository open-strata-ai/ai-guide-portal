// Domain types for ai-guide-portal (assembly domain, DESIGN §3 / §12 / §13).

export type Profile = 'starter' | 'standard' | 'advanced' | 'full';

export type CapabilityId =
  | 'chat'
  | 'rag'
  | 'modelProvider'
  | 'memory'
  | 'vectorStore'
  | 'agent'
  | 'workflow'
  | 'sandbox';

/** A single business-language capability card (DESIGN §13.2). */
export interface CapabilityCard {
  id: CapabilityId;
  /** Business-language label shown to non-technical users. */
  label: string;
  description: string;
  dependsOn: CapabilityId[];
  enabledByDefault: boolean;
  /** When true the card is greyed-out in the wizard (not in tenant whitelist). */
  restricted?: boolean;
}

/** A node in the expanded transitive dependency graph (DESIGN §13.3). */
export interface DependencyNode {
  id: CapabilityId;
  label: string;
  dependsOn: CapabilityId[];
}

/** Result of a preview calculation (DESIGN §13.3, preview-calc ADR-0002). */
export interface DeploymentPlan {
  graph: DependencyNode[];
  /** New components that must be provisioned. */
  add: CapabilityId[];
  /** Components already enabled in the tenant and reused (the "M" in reuse-M). */
  reuse: CapabilityId[];
  /** Components to be taken offline. */
  drop: CapabilityId[];
  /** Declared downtime; automatic upgrade is zero-downtime. */
  downtime: 'none' | 'rolling' | 'maintenance';
}

export type ComponentHealth = 'pending' | 'ready' | 'failed' | 'degraded';

export interface ComponentStatus {
  id: CapabilityId;
  label: string;
  health: ComponentHealth;
  /** Quota impact of this upgrade on the tenant package. */
  quota: { cpu: number; token: number; qps: number; vector: number };
}

export type ApplyStatus = 'idle' | 'validating' | 'applying' | 'ready' | 'failed';

/** Tenant-level PlatformManifest snapshot (DESIGN §12.1). */
export interface PlatformManifest {
  tenantId: string;
  profile: Profile;
  enabled: CapabilityId[];
  /** Per-tenant theme override (DESIGN §8 / §14.2). */
  theme?: { colorPrimary?: string; dark?: boolean };
}

/** Declarative rollback target (DESIGN §13.5, rollback-ux ADR-0003). */
export interface RollbackTarget {
  /** 'manifest' = whole-manifest rollback; 'component' = single capability. */
  granularity: 'manifest' | 'component';
  capability?: CapabilityId;
  enabled: boolean;
}

/** Canary upgrade phase (DESIGN §13.5, grayscale-upgrade-display ADR-0004). */
export type CanaryPhase = 'dual-write' | 'verifying' | 'cutover';
