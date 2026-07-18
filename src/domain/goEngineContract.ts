/**
 * Go engine interface contract (R-004).
 *
 * The interface versions are pinned in `openstrata-meta/bom.yaml`
 * `strata.interface_versions` and are the SINGLE SemVer source of truth. The
 * Java backend <-> Go engine (ai-dependency-resolver / ai-provisioning-engine)
 * contract is negotiated at this version. The frontend does not call the Go
 * engine directly, but it surfaces and validates the contract version so the
 * UI can warn when the backend reports a mismatched interface version.
 *
 * DO NOT diverge from bom.yaml. If bom.yaml changes, regenerate this constant
 * block (R-004).
 */
export const GO_ENGINE_INTERFACE_VERSIONS = {
  Gateway: '1.0.0',
  LLMProvider: '1.0.0',
  AgentRuntime: '1.0.0',
  VectorStore: '1.0.0',
  Cache: '1.0.0',
  Auth: '1.0.0',
  Tracing: '1.0.0',
  RAG: '1.0.0',
  LowCode: '1.0.0',
  Workflow: '1.0.0',
  Sandbox: '1.0.0',
  CICD: '1.0.0',
  MultiTenancy: '1.0.0',
  MLOps: '1.0.0',
  Eval: '1.0.0',
} as const;

export type GoEngineInterface = keyof typeof GO_ENGINE_INTERFACE_VERSIONS;

/** Header used by the Go engine contract negotiation (R-004). */
export const GO_ENGINE_CONTRACT_HEADER = 'X-Interface-Version';

export interface GoEngineContractReport {
  interfaceName: GoEngineInterface;
  expected: string;
  reported: string | null;
  /** true when reported == expected (or unknown, i.e. not yet reported). */
  ok: boolean;
}

/** Compare a reported interface version against the pinned SemVer. */
export function evaluateContract(
  interfaceName: GoEngineInterface,
  reported: string | null,
): GoEngineContractReport {
  const expected = GO_ENGINE_INTERFACE_VERSIONS[interfaceName];
  return {
    interfaceName,
    expected,
    reported,
    ok: reported === null || reported === expected,
  };
}
