import { useQueryClient } from '@tanstack/react-query';
import { useMeeting } from '@videosdk.live/react-sdk';
import { Participant } from '@videosdk.live/react-sdk/dist/types/participant';
import { ReactNode, createContext, useContext, useMemo } from 'react';
import { CallLog } from '@local/api-generated';


export interface AppContextType {
  localParticipant: Participant;
  remoteParticipant?: Participant;
  patientId: string;
  userId: string;
  userType: 'doctor' | 'personnel';
  callLog: CallLog;
}

const AppContext = createContext<AppContextType>({
  localParticipant: {} as Participant,
  patientId: '',
  userId: '',
  userType: 'personnel',
  callLog: {} as CallLog,
});

export const useCallContext = () => useContext(AppContext);

interface DoctorWebSocketProviderProps {
  children: ReactNode;
  patientId: string;
  userId: string;
  userType: AppContextType['userType'];
  callLog: CallLog;
}

export function CallContextProvider({
  children,
  patientId,
  userType,
  userId,
  callLog,
}: DoctorWebSocketProviderProps) {
  const queryClient = useQueryClient();

  const { participants, localParticipant } = useMeeting({
    onMeetingJoined: () => {
      queryClient.invalidateQueries();
    },
    onMeetingLeft: () => {
      queryClient.invalidateQueries();
    },
  });

  const remoteParticipant = useMemo(() => {
    for (const [key, value] of participants) {
      if (key !== localParticipant?.id && !value.local) return value;
    }
    return undefined;
  }, [participants, localParticipant?.id]);

  return (
    <AppContext.Provider
      value={{
        localParticipant,
        remoteParticipant,
        patientId,
        userType,
        userId,
        callLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
