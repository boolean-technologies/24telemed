import { Button } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { Shell } from './Shell';
import { useLogout, useSession } from './SessionLayout';

export function AppLayout() {
  const { partner } = useSession();
  const logout = useLogout();

  return (
    <Shell
      partnerName={partner.name}
      logoUrl={partner.logo_url}
      actions={
        <>
          <Link to="/app">
            <Button type="text">My consultations</Button>
          </Link>
          <Button onClick={logout}>Sign out</Button>
        </>
      }
    >
      <Outlet />
    </Shell>
  );
}
