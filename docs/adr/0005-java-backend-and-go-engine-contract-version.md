# ADR-0005: Contract version between Java backend and Go engine

- **Status**: Accepted — see R-004 in `openstrata-meta/contracts/adr-resolutions.md`
- **Date**: 2026-07-17
- **Suggested by**: OpenStrata Architecture Group
- **Repository**: ai-guide-portal
- **Source**: `docs/DESIGN.md` §11 Open Issue
- **Associations**: `ai-dependency-resolver`, `ai-provisioning-engine`

##Context

How the interface versions of `ai-dependency-resolver` / `ai-provisioning-engine` are aligned with `bom.yaml` `interface_versions` (§16.1). ---

## Decision Options (Options Considered)

1. **Maintain status quo / conservative default**: Maintain current behavior, controlled by configuration switches or explicit parameters, and do not introduce destructive changes.
2. **Unified implementation after cross-repository alignment**: Make a clear contract with the relevant services (`ai-dependency-resolver, ai-provisioning-engine`) before implementation.
3. **Phased introduction**: Leave a placeholder/default switch in the current stage, and solidify it in subsequent stages after the dependent capabilities are ready (see Related Architecture §).

## Recommended decision (Decision)

This ADR solidifies the "contract version between Java backend and Go engine" into an architectural decision record and incorporates it into `docs/adr/` for continuous tracking. This issue stems from the `docs/DESIGN.md` §11 open issue and is still open.

**Conservative Default Principle**: Before the final decision is made, the "minimum available + explicit configuration switch" shall prevail, maintain the current behavior, and not destroy the existing contract and cross-repository SPI interface; this ADR status will be written back after review by the relevant team.



## To be aligned / Follow-ups (Follow-ups)

- Alignment confirmation with `ai-dependency-resolver`: clarify responsibility boundaries/interface contracts/data flow direction to avoid double writing or semantic drift.
- Alignment confirmation with `ai-provisioning-engine`: clarify responsibility boundaries/interface contracts/data flow direction to avoid double writing or semantic drift.
- Associated architecture documents §16.1 (as a basis for decision-making and a source of consistency verification).
- **Resolution (R-004)**: Accepted — single SemVer for the Java-backend ↔ Go-engine contract, pinned in `bom.yaml` `interface_versions`; `ai-guide-portal`, `ai-dependency-resolver`, and `ai-provisioning-engine` MUST align to it. See `openstrata-meta/contracts/adr-resolutions.md`.

## Traceback

- Upstream design: `docs/DESIGN.md` §11 Open issue
- Relevance index: see `docs/adr/README.md`
