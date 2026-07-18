# ai-guide-portal · Specifications (SPECS)

> Feature specifications, build/deployment configuration, API integration, and data model (DDL) for the guide portal. Derived from DESIGN.md §2 (Feature Modules & Routing), §8 (Build & Deployment), §5 (Backend API Integration), and A.8 (Data Model & Persistence).

## Meta

| Item | Value |
| --- | --- |
| **repo** | `ai-guide-portal` |
| **frontend** | TypeScript · React 18 + Vite + Ant Design |
| **backend** | Java · Spring Boot 3.x (portal orchestration) |
| **platform version** | v1.0.0 |
| **doc status** | draft |

---

## 1. Feature Modules & Routing Specification

### 1.1 Route Table

| Route | Feature | Backend Dependency | Auth Guard | Lazy Load |
| --- | --- | --- | --- | --- |
| `/` | Landing: "5-second start" + profile selection | Java BE → `ai-dependency-resolver` | No (public) | No |
| `/wizard` | Capability selection wizard (checkbox cards) | Java BE capabilities catalog | `AuthGuard` (Keycloak) | Yes |
| `/plan` | Dependency expansion + change preview | Java BE → `ai-dependency-resolver` | `AuthGuard` | Yes |
| `/apply` | One-click execute (confirm → Manifest → orchestrate) | Java BE → `ai-provisioning-engine` | `AuthGuard` | Yes |
| `/status` | Status dashboard (component deployment / health) | Java BE → ArgoCD/Compose status | `AuthGuard` | Yes |
| `/rollback` | Declarative rollback + pre-check | Java BE → Manifest rewrite + replay | `AuthGuard` | Yes |

### 1.2 Feature Detail Specifications

#### Landing Page (`/`)

| Property | Value |
| --- | --- |
| **Primary CTA** | "I want a Chat Agent" (big button, hero placement) |
| **Profile Selection** | Dropdown: `starter` / `standard` / `advanced` / `full` |
| **Model Key Input** | Text field for `qwen-cloud` or `openai` API key |
| **Quickstart Flow** | Click CTA → enter key → backend generates starter Manifest → redirect to `ai-portal-frontend /chat` |
| **Equivalent CLI** | `aictl init --profile starter --model qwen-cloud && aictl up` |

#### Wizard Page (`/wizard`)

| Property | Value |
| --- | --- |
| **UI Component** | `CapabilityCard` grid (from `@openstrata/ui-kit`) |
| **Card States** | Available (selectable) / Unavailable (grayed, "Request admin") / Selected (checked) / Selected + missing deps (warning badge) |
| **Categories** | Chat & Conversation, Knowledge & Retrieval, Tool Use, Observability, Security |
| **Pagination** | 1 page (cards categorized into accordion sections) |
| **Validation** | On "Next": check all selections resolve to valid dependencies |
| **Storage** | Selections cached in Zustand; persisted to `localStorage` as recovery backup |

#### Plan Page (`/plan`)

| Property | Value |
| --- | --- |
| **UI Components** | `MermaidRenderer` (dependency graph), `DiffView` (new/reuse/drop table) |
| **Data** | `{graph, add, reuse, drop, downtime, resourceImpact}` from backend |
| **Display** | Dependency graph visualization + component delta table (new N / reused M / offline K) |
| **Resource Preview** | CPU / Token / QPS / Vector count delta from pre-check |
| **User Actions** | Confirm → navigate to Apply; Back → return to Wizard |
| **Error State (409)** | Highlight missing dependencies with "One-click completion" (fill all missing) button |

#### Apply Page (`/apply`)

| Property | Value |
| --- | --- |
| **UI Components** | `Steps` (validate → generate → apply → ready), `LogViewer` (streaming logs) |
| **Phases** | 1. Validation (dependency + quota pre-check) / 2. Manifest write / 3. Provisioning trigger / 4. Component ready polling |
| **Confirmation** | `ConfirmModal` with resource impact summary before final apply |
| **Streaming** | Orchestration logs via SSE/WebSocket, displayed in virtual-scrolled `LogViewer` |
| **Error Handling** | Phase failure → error detail + retry button; can rollback from failed state |

#### Status Page (`/status`)

| Property | Value |
| --- | --- |
| **UI Components** | `StatusBadge` + `DataTable` (component status rows) |
| **Columns** | Component ID, Capability, Status (pending/ready/failed), Health (healthy/degraded/unhealthy), Last Transition |
| **Auto-refresh** | SSE/WebSocket push (preferred) → fallback to 15s polling |
| **Filtering** | Filter by status / capability category |

#### Rollback Page (`/rollback`)

| Property | Value |
| --- | --- |
| **UI Components** | `DataTable` (audit history), `ConfirmModal` |
| **Data Source** | `manifest_audit` table → recent Manifest changes with before/after |
| **Selection** | Per-capability disable or full Manifest version restore |
| **Pre-check** | Dependency check (no other enabled caps depend on target) + SPI compatibility check |
| **Execution** | Backend rewrites Manifest → provisioning engine replays diff |

---

## 2. Build & Deployment Specification

### 2.1 Frontend Build

| Property | Value |
| --- | --- |
| **Framework** | Vite (TypeScript + React 18) |
| **Build Command** | `npm run build` |
| **Output** | Static assets in `dist/` |
| **Code Splitting** | `React.lazy` per route (wizard, plan, apply, status, rollback) |
| **Environment Variables** | `VITE_GUIDE_API_BASE` (backend URL), `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, `VITE_KEYCLOAK_CLIENT_ID` |
| **Dependency Pinning** | `@openstrata/ui-kit` version from `bom.yaml` |

### 2.2 Backend Build

| Property | Value |
| --- | --- |
| **Framework** | Spring Boot 3.x |
| **Build Tool** | Maven |
| **Build Command** | `mvn package -DskipTests` (production) / `mvn test` (CI) |
| **Output** | Executable `.jar` |
| **Base Image** | `eclipse-temurin:21-jre-alpine` (Dockerfile) |
| **Environment Variables** | `GUIDE_API_PORT`, `GUIDE_DB_URL`, `GUIDE_DB_USER`, `GUIDE_DB_PASSWORD`, `GUIDE_KEYCLOAK_*`, `GUIDE_RESOLVER_URL`, `GUIDE_PROVISIONER_URL` |

### 2.3 Containerization

| Component | Image | Port | Health Check |
| --- | --- | --- | --- |
| **Frontend** | `nginx:alpine` + built `dist/` | 80 | `GET /health` → 200 |
| **Backend** | `eclipse-temurin:21-jre-alpine` + `.jar` | 8080 | `GET /actuator/health` → 200 |

### 2.4 Kubernetes Deployment

| Resource | Replicas | Notes |
| --- | --- | --- |
| Frontend Deployment | 2 | `nginx:alpine`, ClusterIP:80, env: `VITE_GUIDE_API_BASE` / `VITE_KEYCLOAK_*` |
| Backend Deployment | 2 | `eclipse-temurin:21-jre-alpine`, ClusterIP:8080, env: `GUIDE_DB_URL` / `GUIDE_RESOLVER_URL` / `GUIDE_PROVISIONER_URL` |
| ConfigMap | 1 per deployment | Environment-specific config |
| Ingress | 1 | Route `guide.openstrata.io` → frontend |
| Service | 2 | Frontend + Backend ClusterIP |

### 2.5 CI/CD Pipeline

**Pipeline**: lint → tsc (frontend) / compile (backend) → unit test → build → Trivy security scan → push image.

| Stage | Frontend | Backend |
| --- | --- | --- |
| Lint | `npm run lint` | — |
| Type check | `npm run tsc --noEmit` | `mvn compile` |
| Unit test | `npm test` | `mvn test` |
| Build | `npm run build` | `mvn package -DskipTests` |
| Security scan | Trivy `fs` scan on `dist/` | Trivy image scan |
| Push | Docker build + push | Docker build + push |

### 2.6 Profile Assembly

| Profile | Includes ai-guide-portal | Notes |
| --- | --- | --- |
| `starter` | Yes | Default installation |
| `standard` | Yes | Default installation |
| `advanced` | Yes | Default installation |
| `full` | Yes | Default installation |

> Guide portal is pinned in all profiles via `openstrata-meta/profiles/*.yaml` with version from `repos.yaml`: `ai-guide-portal@v1.0.0`.

---

## 3. Backend API Integration Specification

### 3.1 API Client Architecture

```
Frontend (TypeScript) → Java Backend (Spring Boot 3.x) → Go Engines
                        └── Anti-Corruption Layer (ACL)
```

- Frontend calls only the Java backend REST API, never Go engines directly.
- Java backend acts as anti-corruption layer (§15.5.2), translating external Go engine DTOs to internal domain objects.
- All requests include `X-Tenant-Id` header for tenant isolation.

### 3.2 Endpoint Specifications

| Method | Path | Request Body | Response | Pre-Check | Notes |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/api/v1/capabilities` | — | `200: CapabilityCard[]` | — | Includes `dependsOn`, `enabledByDefault` |
| `POST` | `/api/v1/plans/preview` | `{selections: string[], profile: string}` | `200: PreviewResponse` | — | Calls `ai-dependency-resolver` for transitive graph |
| `POST` | `/api/v1/plans/{id}/apply` | — | `202: ApplyResult` | Dependency validation + resource quota | Fails `409` if pre-check fails |
| `GET` | `/api/v1/deployments/status` | — | `200: ComponentStatus[]` | — | SSE/WebSocket for live updates |
| `POST` | `/api/v1/rollbacks` | `{target: {capability: string, enabled: false}}` | `202: RollbackResult` | Dependency check | Rewrites Manifest, replays provisioning |

### 3.3 Error Response Format

```json
{
  "error": {
    "code": "DEPENDENCY_MISSING",
    "message": "Capability 'rag' requires 'modelProvider', 'memory', 'vectorStore'",
    "details": {
      "missingDependencies": ["modelProvider", "memory", "vectorStore"],
      "affectedCapability": "rag"
    }
  }
}
```

### 3.4 Rate Limiting

| Endpoint | Rate Limit | Window |
| --- | --- | --- |
| `POST /api/v1/plans/preview` | 20 req/min | per tenant |
| `POST /api/v1/plans/{id}/apply` | 5 req/min | per tenant |
| `GET /api/v1/capabilities` | 60 req/min | per tenant |
| `GET /api/v1/deployments/status` | 120 req/min | per tenant |

---

## 4. Data Model & Persistence (DDL)

### 4.1 Database Configuration

| Property | Value |
| --- | --- |
| **Database** | PostgreSQL (shared cluster, §8.2) |
| **Schema Isolation** | Single database with `tenant_id` column-based isolation + RLS |
| **Migration** | Flyway (Java) |
| **ORM** | JPA / MyBatis-Flex |

### 4.2 Tenant-Level PlatformManifest

Stores the full `openstrata.yaml` content per tenant (§12.1 single source of truth). One row per tenant.

```sql
CREATE TABLE platform_manifest (
    tenant_id      VARCHAR(64)  NOT NULL,
    profile        VARCHAR(32)  NOT NULL,         -- starter | standard | advanced | full
    manifest_yaml  TEXT         NOT NULL,         -- openstrata.yaml full content (spec section)
    version        BIGINT       NOT NULL,         -- optimistic lock
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    PRIMARY KEY (tenant_id)
);
```

### 4.3 Capability Selection

Tracks wizard session selections. Supports preview and rollback scenarios.

```sql
CREATE TABLE capability_selection (
    id             BIGSERIAL PRIMARY KEY,
    tenant_id      VARCHAR(64)  NOT NULL,
    capability     VARCHAR(64)  NOT NULL,
    enabled        BOOLEAN      NOT NULL,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_cap_sel_tenant ON capability_selection(tenant_id);
```

### 4.4 Deployment Plan

Stores dependency expansion results (§13.3). Used for apply and rollback replay.

```sql
CREATE TABLE deployment_plan (
    id             VARCHAR(36)  PRIMARY KEY,       -- UUID
    tenant_id      VARCHAR(64)  NOT NULL,
    graph_json     JSONB        NOT NULL,         -- transitive dependency graph
    add_count      INT          NOT NULL,
    reuse_count    INT          NOT NULL,
    drop_count     INT          NOT NULL,
    status         VARCHAR(16)  NOT NULL,         -- validating | applying | ready | failed
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);
```

### 4.5 Manifest Audit Log

Immutable append-only audit trail for all Manifest changes (§13.5 / §14.6).

```sql
CREATE TABLE manifest_audit (
    id             BIGSERIAL PRIMARY KEY,
    tenant_id      VARCHAR(64)  NOT NULL,
    actor          VARCHAR(64)  NOT NULL,
    op             VARCHAR(32)  NOT NULL,         -- create | enable | disable | rollback
    capability     VARCHAR(64),
    before_yaml    TEXT,
    after_yaml     TEXT,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);
```

### 4.6 Persistence Constraints

| Constraint | Rule |
| --- | --- |
| **Dependency validation** | Before writing Manifest, application layer runs dependency check (§12.4 table: e.g., `rag` requires `modelProvider` + `memory` + `vectorStore` already enabled) |
| **Resource quota check** | Before writing Manifest, verify new resource requirements don't exceed tenant package quota (§13.5) |
| **Audit immutability** | `manifest_audit` rows are append-only; no UPDATE or DELETE allowed |
| **Audit coverage** | All Manifest changes are audited regardless of whether `security` profile is enabled |
| **Tenant isolation** | All queries include `tenant_id` predicate; PostgreSQL Row-Level Security (RLS) enforced at database level (§8.2) |
| **Optimistic locking** | `platform_manifest.version` is incremented on write; concurrent write conflicts are rejected |
| **Idempotent apply** | `deployment_plan` status transitions are idempotent; re-applying a ready plan is a no-op |

### 4.7 Entity Relationships

- `platform_manifest` (1) ↔ `capability_selection` (N) via `tenant_id`
- `platform_manifest` (1) ↔ `deployment_plan` (N) via `tenant_id`
- `platform_manifest` (1) ↔ `manifest_audit` (N) via `tenant_id`

All tables are tenant-scoped via `tenant_id` column with RLS enforcement.

---

## Traceability Matrix

| This Document Section | Architecture Document § |
| --- | --- |
| §1 Feature Modules & Routing | §13.1 (Portal Modules), §13.2 (Business Language Mapping) |
| §2 Build & Deployment | §15.5.1 (TS+Java Framework), §15.6.2 (Per-repo CI), §12.2 (Profile) |
| §3 Backend API Integration | §15.5.1 (Java Backend), §4.7.3 (Keycloak), §14.1 (Engines) |
| §4 Data Model & Persistence (DDL) | §12.1 (Manifest), §8.2 (DB Isolation), §13.5 (Audit) |

---

## Change Log

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| v0.1-draft | 2026-07-17 | OpenStrata Architecture Team | Initial draft from DESIGN.md §2+§8+§5+A.8 backfill |
