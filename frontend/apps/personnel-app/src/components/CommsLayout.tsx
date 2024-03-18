import { useCurrentUser } from '@local/api-generated';
import { PersonnelCommunicationProvider } from '@local/websocket';
import { Outlet } from 'react-router-dom';
import { CallingDoctor } from './CallingDoctor';

export function CommsLayout() {
  const { data } = useCurrentUser();
  const userId = data?.id as string;

  return (
    <PersonnelCommunicationProvider userId={userId}>
      <Outlet />
      <CallingDoctor />
    </PersonnelCommunicationProvider>
  );
}
