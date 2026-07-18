import axios, { AxiosInstance } from 'axios';
import { getSession } from './sessionStore';
import type { GuidePort } from '../domain/GuidePort';
import type {
  CapabilityCard,
  DeploymentPlan,
  PlatformManifest,
  RollbackTarget,
  ComponentStatus,
} from '../domain/types';

const BASE = import.meta.env.VITE_GUIDE_API_BASE ?? '/api/v1';

/**
 * Adapter implementing `GuidePort` against this repository's Java backend
 * (DESIGN §5 / Class A §7). Injects `X-Tenant-Id` + `Authorization: Bearer`
 * and normalizes the documented error taxonomy (§5.2) into a typed error.
 */
export class GuideApiClient implements GuidePort {
  private http: AxiosInstance;

  constructor(base = BASE) {
    this.http = axios.create({ baseURL: base });
  }

  private headers(): Record<string, string> {
    const { tenantId, token } = getSession();
    return {
      'X-Tenant-Id': tenantId,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getCapabilities(): Promise<CapabilityCard[]> {
    const { data } = await this.http.get<CapabilityCard[]>('/capabilities', {
      headers: this.headers(),
    });
    return data;
  }

  async preview(selections: string[], profile: string): Promise<DeploymentPlan> {
    const { data } = await this.http.post<DeploymentPlan>(
      '/plans/preview',
      { selections, profile },
      { headers: this.headers() },
    );
    return data;
  }

  async apply(planId: string) {
    const { data } = await this.http.post<{ id: string; status: string }>(
      `/plans/${planId}/apply`,
      {},
      { headers: this.headers() },
    );
    return data;
  }

  async getStatus(): Promise<ComponentStatus[]> {
    const { data } = await this.http.get<ComponentStatus[]>(
      '/deployments/status',
      { headers: this.headers() },
    );
    return data;
  }

  async rollback(target: RollbackTarget) {
    const { data } = await this.http.post<{ id: string; status: string }>(
      '/rollbacks',
      target,
      { headers: this.headers() },
    );
    return data;
  }

  async getManifest(): Promise<PlatformManifest> {
    const { data } = await this.http.get<PlatformManifest>('/manifest', {
      headers: this.headers(),
    });
    return data;
  }
}

export const guideApi: GuidePort = new GuideApiClient();
