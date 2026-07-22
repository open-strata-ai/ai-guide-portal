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
 *
 * Wizard inputs are persisted to localStorage so a page refresh keeps what the
 * user selected (DESIGN §3.1 — the wizard is a real, resumable authoring
 * session, not an in-memory throwaway). The heavy lifting (preview / apply /
 * status / rollback) still goes through the real GuidePort backend.
 */
const PERSIST_KEY = 'openstrata.guide.assembly';

interface PersistedShape {
  profile: Profile;
  selections: CapabilityId[];
}

function loadPersisted(): Partial<PersistedShape> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PersistedShape;
  } catch {
    return {};
  }
}

function persist(state: AssemblyState): void {
  if (typeof localStorage === 'undefined') return;
  const data: PersistedShape = { profile: state.profile, selections: state.selections };
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(data));
  } catch {
    // ignore quota / serialization errors — persistence is best-effort
  }
}

const initial = loadPersisted();

/**
 * Default capability modules auto-selected when a profile is chosen (EU-06).
 * Selecting a profile must load its starter set so the wizard is never empty
 * (the reported "profile tabs don't load default modules" bug). Each profile's
 * defaults are a sensible, dependency-consistent capability set.
 */
const PROFILE_DEFAULTS: Record<Profile, CapabilityId[]> = {
  starter: ['chat', 'modelProvider'],
  standard: ['chat', 'modelProvider', 'memory'],
  advanced: ['chat', 'modelProvider', 'memory', 'vectorStore', 'rag', 'agent'],
  full: ['chat', 'rag', 'modelProvider', 'memory', 'vectorStore', 'agent', 'workflow', 'sandbox'],
};

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

export const useAssemblyStore = create<AssemblyState>((set, get) => ({
  profile: initial.profile ?? 'starter',
  selections: initial.selections ?? [],
  dependencyGraph: [],
  plan: null,
  applyStatus: 'idle',
  currentManifest: null,

  setProfile: (profile) => {
    // RC-6: selecting a profile also loads its default capability modules so the
    // wizard reflects a real, non-empty selection for that profile.
    set({ profile, selections: PROFILE_DEFAULTS[profile] ?? [] });
    persist(get());
  },
  toggleSelection: (id) => {
    set((s) => ({
      selections: s.selections.includes(id)
        ? s.selections.filter((x) => x !== id)
        : [...s.selections, id],
    }));
    persist(get());
  },
  setPlan: (plan) => {
    set({ plan, dependencyGraph: plan.graph });
    persist(get());
  },
  setApplyStatus: (applyStatus) => set({ applyStatus }),
  setManifest: (currentManifest) => set({ currentManifest }),
  reset: () => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(PERSIST_KEY);
      } catch {
        // ignore
      }
    }
    set({
      profile: 'starter',
      selections: [],
      dependencyGraph: [],
      plan: null,
      applyStatus: 'idle',
    });
  },
}));
