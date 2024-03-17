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
}

const AppContext = createContext<AppContextType>({
  leaveMeeting: () => {},
  localParticipant: {} as Participant,
  patientId: ""
});

export const useCallContext = () => useContext(AppContext);

interface DoctorWebSocketProviderProps {
  children: ReactNode;
  patientId: string;
}

export function CallContextProvider({
  children,
  patientId,
}: DoctorWebSocketProviderProps) {

  const queryClient = useQueryClient();

  const { join, leave, participants, localParticipant,  } = useMeeting({
    onMeetingJoined: () => {
      queryClient.invalidateQueries();
      console.log("-----JOINED------")
    },
    onMeetingLeft: () => {
      console.log('Meeting left');
    },
  });

  const leaveMeeting = () => {};

  useEffect(() => {
    join();
    return () => { leave() };
  }, []);
  console.log(participants)

  const remoteParticipant = useMemo(() => {
    for (const [key, value] of participants) {
      if (key !== localParticipant.id && !value.local) return value;
    }
    return undefined;
  }, [participants]);

  return (
    <AppContext.Provider
      value={{ localParticipant, remoteParticipant, leaveMeeting, patientId }}
    >
      {children}
    </AppContext.Provider>
  );
}
