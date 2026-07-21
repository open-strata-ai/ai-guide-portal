import { describe, it, expect, beforeEach, test } from 'vitest';
import { useAssemblyStore } from '../application/assembly/assemblyStore';

describe('assemblyStore (guide wizard state)', () => {
  beforeEach(() => {
    useAssemblyStore.getState().reset();
    localStorage.clear();
  });

  it('setProfile updates the active profile (lock behavior)', () => {
    useAssemblyStore.getState().setProfile('advanced');
    expect(useAssemblyStore.getState().profile).toBe('advanced');
  });

  it('reset clears profile and selections', () => {
    const s = useAssemblyStore.getState();
    s.setProfile('full');
    s.toggleSelection('cap-x' as never);
    s.reset();
    const a = useAssemblyStore.getState();
    expect(a.profile).toBe('starter');
    expect(a.selections).toEqual([]);
  });

  // ACCEPTANCE GAP (EU-06): selecting a profile MUST auto-select that profile's
  // default capability modules. Today setProfile() only flips the profile
  // string; no defaults are applied. This encodes the contract and currently
  // REDS, proving the harness catches the reported "profile tabs don't load
  // default modules" bug.
  it('selecting a profile auto-selects its default modules', () => {
    useAssemblyStore.getState().setProfile('advanced');
    const { selections } = useAssemblyStore.getState();
    expect(selections.length).toBeGreaterThan(0);
  });

  // ACCEPTANCE GAP (EU-06): ApplyPage's "Confirm & apply" is disabled when no
  // plan exists, so the click never fires. The action must be reachable.
  test.todo(
    'Confirm & apply dispatches guideApi.apply even without a previewed plan',
  );
});
