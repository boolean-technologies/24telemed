import { useCurrentUser } from '@local/api-generated';
import {
  DoctorCommunicationProvider,
  PersonnelCommunicationProvider,
} from '@local/websocket';
import { Outlet } from 'react-router-dom';

export type CommsProviderProps = {
  type: 'doctor' | 'personnel';
};

export function CommsProvider({ type }: CommsProviderProps) {
  const { data } = useCurrentUser();
  const userId = data?.id as string;

  if (type === 'doctor')
    return (
      <DoctorCommunicationProvider userId={userId}>
        <Outlet />
      </DoctorCommunicationProvider>
    );

  return (
    <PersonnelCommunicationProvider userId={userId}>
      <Outlet />
    </PersonnelCommunicationProvider>
  );
}
