import { useCurrentUser } from '@local/api-generated';
import { DoctorCommunicationProvider } from '@local/websocket';
import { Outlet } from 'react-router-dom';

export function CommsLayout() {
  const { data } = useCurrentUser();
  const userId = data?.id as string;

  return (
    <DoctorCommunicationProvider userId={userId}>
      <Outlet />
    </DoctorCommunicationProvider>
  );
}
