import { describe, it, expect, beforeEach, vi } from 'vitest';

function stubLocalStorage() {
  const store: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = String(v);
    },
    removeItem: (k: string) => {
      delete store[k];
    },
  };
  return store;
}

describe('assemblyStore persistence', () => {
  beforeEach(() => {
    stubLocalStorage();
    vi.resetModules();
  });

  it('persists profile + selections to localStorage on toggle', async () => {
    const { useAssemblyStore } = await import('./assemblyStore');
    useAssemblyStore.getState().toggleSelection('chat');
    const raw = localStorage.getItem('openstrata.guide.assembly');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(parsed.selections).toContain('chat');
    expect(parsed.profile).toBe('starter');
  });

  it('hydrates initial state from localStorage', async () => {
    localStorage.setItem(
      'openstrata.guide.assembly',
      JSON.stringify({ profile: 'advanced', selections: ['chat', 'modelProvider'] }),
    );
    const { useAssemblyStore } = await import('./assemblyStore');
    expect(useAssemblyStore.getState().profile).toBe('advanced');
    expect(useAssemblyStore.getState().selections).toEqual(['chat', 'modelProvider']);
  });

  it('reset() clears persisted state', async () => {
    const { useAssemblyStore } = await import('./assemblyStore');
    useAssemblyStore.getState().toggleSelection('chat');
    expect(localStorage.getItem('openstrata.guide.assembly')).toBeTruthy();
    useAssemblyStore.getState().reset();
    expect(localStorage.getItem('openstrata.guide.assembly')).toBeNull();
    expect(useAssemblyStore.getState().selections).toEqual([]);
  });
});
