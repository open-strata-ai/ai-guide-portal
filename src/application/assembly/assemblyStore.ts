import { create } from 'zustand';
import type {
  ApplyStatus,
  CapabilityId,
  DeploymentPlan,
  PlatformManifest,
  Profile,
} from '../../domain/types';

/**
 * Assembly wizard state (DESIGN §3.1). The single "wizard state" of this
 * portal: profile, user selections, expanded dependency graph, plan, apply
 * status, and the current tenant manifest snapshot.
 */
interface AssemblyState {
  profile: Profile;
  selections: CapabilityId[];
  dependencyGraph: DeploymentPlan['graph'];
  plan: DeploymentPlan | null;
  applyStatus: ApplyStatus;
  currentManifest: PlatformManifest | null;

  setProfile: (p: Profile) => void;
  toggleSelection: (id: CapabilityId) => void;
  setPlan: (plan: DeploymentPlan) => void;
  setApplyStatus: (s: ApplyStatus) => void;
  setManifest: (m: PlatformManifest) => void;
  reset: () => void;
}

export const useAssemblyStore = create<AssemblyState>((set) => ({
  profile: 'starter',
  selections: [],
  dependencyGraph: [],
  plan: null,
  applyStatus: 'idle',
  currentManifest: null,

  setProfile: (profile) => set({ profile }),
  toggleSelection: (id) =>
    set((s) => ({
      selections: s.selections.includes(id)
        ? s.selections.filter((x) => x !== id)
        : [...s.selections, id],
    })),
  setPlan: (plan) => set({ plan, dependencyGraph: plan.graph }),
  setApplyStatus: (applyStatus) => set({ applyStatus }),
  setManifest: (currentManifest) => set({ currentManifest }),
  reset: () =>
    set({
      selections: [],
      dependencyGraph: [],
      plan: null,
      applyStatus: 'idle',
    }),
}));
