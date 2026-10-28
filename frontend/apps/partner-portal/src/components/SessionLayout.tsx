import { createContext, useContext, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Result } from 'antd';
import { CurrentUser, useCurrentUser } from '@local/api-generated';
import { PageLoading, tokenManager } from '@local/shared-components';
import { PersonnelCommunicationProvider } from '@local/websocket';
import { Partner, useMyPartner } from '../api/partners';
import { PortalApiError } from '../api/client';
import { lastPartnerSlug } from '../utils';
import { CallStatusModal } from './CallStatusModal';

type Session = { user: CurrentUser; partner: Partner };

const SessionContext = createContext<Session | null>(null);

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used inside SessionLayout');
  return session;
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return () => {
    tokenManager.setToken();
    queryClient.clear();
    const slug = lastPartnerSlug.get();
    navigate(slug ? `/${slug}/login` : '/', { replace: true });
  };
}

/** Signed-in area: requires a patient account that belongs to a partner, and
 * keeps the call socket open so doctors' answers arrive on any page. */
export function SessionLayout() {
  const hasToken = !!tokenManager.getToken();
  const user = useCurrentUser(!hasToken, false);
  const partner = useMyPartner();
  const logout = useLogout();

  const unauthorized = [401, 403].includes((user.error as { status?: number } | null)?.status ?? 0);
  useEffect(() => {
    if (unauthorized) logout();
  }, [unauthorized]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (partner.data) lastPartnerSlug.set(partner.data.slug);
  }, [partner.data]);

  if (!hasToken) {
    const slug = lastPartnerSlug.get();
    return <Navigate to={slug ? `/${slug}/login` : '/'} replace />;
  }

  if (partner.error instanceof PortalApiError && partner.error.status === 404) {
    return (
      <Result
        status="warning"
        title="This account isn't registered with a partner clinic"
        subTitle="Sign in with the account you created on your clinic's page."
        extra={<Button onClick={logout}>Sign out</Button>}
      />
    );
  }

  if ((user.isError && !unauthorized) || partner.isError) {
    return (
      <Result
        status="error"
        title="We couldn't load your account"
        subTitle="Check your connection and try again."
        extra={<Button onClick={() => window.location.reload()}>Retry</Button>}
      />
    );
  }

  if (!user.data || !partner.data) {
    return <PageLoading />;
  }

  return (
    <SessionContext.Provider value={{ user: user.data, partner: partner.data }}>
      <PersonnelCommunicationProvider userId={user.data.id as string}>
        <Outlet />
        <CallStatusModal />
      </PersonnelCommunicationProvider>
    </SessionContext.Provider>
  );
}
