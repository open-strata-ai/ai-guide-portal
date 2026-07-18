import {
  GO_ENGINE_INTERFACE_VERSIONS,
  GO_ENGINE_CONTRACT_HEADER,
  evaluateContract,
  type GoEngineInterface,
  type GoEngineContractReport,
} from '../domain/goEngineContract';

/**
 * go-engine-contract-client (manifest module, R-004).
 *
 * The Java backend is the only component that calls ai-dependency-resolver /
 * ai-provisioning-engine (Go). This client is the frontend-side view of that
 * contract: it reports the pinned interface versions (bom.yaml) and validates
 * whatever versions the backend echoes back. It never diverges from the single
 * SemVer source of truth.
 */
export interface GoEngineContractStatus {
  reported: Partial<Record<GoEngineInterface, string>> | null;
  reports: GoEngineContractReport[];
  allOk: boolean;
}

export function buildContractStatus(
  reported: Partial<Record<GoEngineInterface, string>> | null,
): GoEngineContractStatus {
  const reports = (Object.keys(GO_ENGINE_INTERFACE_VERSIONS) as GoEngineInterface[]).map(
    (name) => evaluateContract(name, reported?.[name] ?? null),
  );
  return {
    reported,
    reports,
    allOk: reports.every((r) => r.ok),
  };
}

/** Header value the backend attaches when calling the Go engine (R-004). */
export function contractHeader(interfaceName: GoEngineInterface): string {
  return `${GO_ENGINE_CONTRACT_HEADER}: ${GO_ENGINE_INTERFACE_VERSIONS[interfaceName]}`;
}
