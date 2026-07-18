import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setSession, type Session } from './sessionStore';

interface SessionContextValue {
  session: Session;
  setTenant: (tenantId: string) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * SessionProvider — single-tenant dev mode (ADR-0002 analogue): mints
 * `tenant_id=local` and a dev token so the portal runs without Keycloak.
 * The Keycloak OIDC path is a stub; wire it here when auth is enabled.
 */
export function SessionProvider({ children }: { children?: React.ReactNode }) {
  const [session, setSessionState] = useState<Session>(() => ({
    tenantId: 'local',
    token: 'dev-token',
    displayName: 'local',
  }));

  useEffect(() => {
    setSession(session);
  }, [session]);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      setTenant: (tenantId: string) =>
        setSessionState((s) => ({ ...s, tenantId })),
    }),
    [session],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
