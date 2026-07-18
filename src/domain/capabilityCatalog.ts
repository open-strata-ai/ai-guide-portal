import type { CapabilityCard, CapabilityId } from './types';

/**
 * Capability catalog — SINGLE SOURCE OF TRUTH (ADR-0001).
 *
 * The DESIGN open question §11#1 asks whether the catalog lives in
 * `meta/guide-portal/` or in the backend `/api/v1/capabilities`. ADR-0001
 * resolves this: the catalog is rendered from the meta-repository capability
 * directory and the frontend holds a typed, read-only copy that MUST match the
 * backend's `GET /api/v1/capabilities` response shape. The Java backend (Class
 * A §7) is the runtime source; this module is the compiled, type-safe
 * contract the frontend builds against. Keep them in lockstep.
 */
export const CAPABILITY_CATALOG: CapabilityCard[] = [
  {
    id: 'chat',
    label: 'Chat Agent',
    description: 'A conversational agent that can chat with users.',
    dependsOn: ['modelProvider'],
    enabledByDefault: true,
  },
  {
    id: 'rag',
    label: 'Let the Agent read my documents',
    description: 'Retrieval-augmented generation over your documents.',
    dependsOn: ['modelProvider', 'memory', 'vectorStore'],
    enabledByDefault: false,
  },
  {
    id: 'modelProvider',
    label: 'Model provider (OpenAI / Qwen)',
    description: 'LLM provider credentials and routing.',
    dependsOn: [],
    enabledByDefault: true,
  },
  {
    id: 'memory',
    label: 'Memory system',
    description: 'Long-term + short-term agent memory.',
    dependsOn: [],
    enabledByDefault: false,
  },
  {
    id: 'vectorStore',
    label: 'Vector store',
    description: 'Embedding index for RAG.',
    dependsOn: [],
    enabledByDefault: false,
  },
  {
    id: 'agent',
    label: 'Autonomous agent',
    description: 'Multi-step agent runtime.',
    dependsOn: ['modelProvider'],
    enabledByDefault: false,
  },
  {
    id: 'workflow',
    label: 'Workflow orchestration',
    description: 'Durable multi-agent workflows.',
    dependsOn: ['agent'],
    enabledByDefault: false,
  },
  {
    id: 'sandbox',
    label: 'Code sandbox',
    description: 'Isolated code execution for agents.',
    dependsOn: ['agent'],
    enabledByDefault: false,
  },
];

const BY_ID = new Map<CapabilityId, CapabilityCard>(
  CAPABILITY_CATALOG.map((c) => [c.id, c]),
);

export function getCapability(id: CapabilityId): CapabilityCard | undefined {
  return BY_ID.get(id);
}

export function getLabel(id: CapabilityId): string {
  return BY_ID.get(id)?.label ?? id;
}
