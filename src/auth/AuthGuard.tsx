import React from 'react';
import { useSession } from '../infrastructure/session';

/**
 * AuthGuard (DESIGN §2 routing guard). In production this enforces Keycloak;
 * in dev single-tenant mode (ADR-0002 analogue) it simply ensures a session
 * exists. Children render only when authorized.
 */
export function AuthGuard({ children }: { children?: React.ReactNode }) {
  const { session } = useSession();
  if (!session?.tenantId) {
    return <div>Unauthorized</div>;
  }
  return <>{children}</>;
}
