import { useQueryClient } from '@tanstack/react-query';
import { useMeeting } from '@videosdk.live/react-sdk';
import { Participant } from '@videosdk.live/react-sdk/dist/types/participant';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';

export interface AppContextType {
  leaveMeeting: () => void;
  localParticipant: Participant;
  remoteParticipant?: Participant;
  patientId: string;
  userId: string;
  userType: 'doctor' | 'personnel';
}

const AppContext = createContext<AppContextType>({
  leaveMeeting: () => {},
  localParticipant: {} as Participant,
  patientId: '',
  userId: '',
  userType: 'personnel',
});

export const useCallContext = () => useContext(AppContext);

interface DoctorWebSocketProviderProps {
  children: ReactNode;
  patientId: string;
  userId: string;
  userType: AppContextType['userType'];
}

export function CallContextProvider({
  children,
  patientId,
  userType,
  userId,
}: DoctorWebSocketProviderProps) {
  const queryClient = useQueryClient();

  const { join, leave, participants, localParticipant } = useMeeting({
    onMeetingJoined: () => {
      queryClient.invalidateQueries();
      console.log('Meeting joined');
    },
    onMeetingLeft: () => {
      console.log('Meeting left');
    },
  });

  const leaveMeeting = () => {};

  const remoteParticipant = useMemo(() => {
    for (const [key, value] of participants) {
      if (key !== localParticipant.id && !value.local) return value;
    }
    return undefined;
  }, [participants]);

  useEffect(() => {
    join();
    return () => {
      leave();
    };
  }, [localParticipant?.id]);

  return (
    <AppContext.Provider
      value={{
        localParticipant,
        remoteParticipant,
        leaveMeeting,
        patientId,
        userType,
        userId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
