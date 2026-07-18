// Module-level session ref so apiClient can inject tenant/token without a
// circular React dependency (same pattern as ai-portal-frontend).
export interface Session {
  tenantId: string;
  token: string | null;
  displayName: string;
}

let session: Session = {
  tenantId: 'local',
  token: null,
  displayName: 'local',
};

export function getSession(): Session {
  return session;
}

export function setSession(next: Partial<Session>): void {
  session = { ...session, ...next };
}
