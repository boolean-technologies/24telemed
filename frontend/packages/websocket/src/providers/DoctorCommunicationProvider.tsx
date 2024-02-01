import { ReactNode, createContext, useContext, useMemo } from 'react';
import { DoctorCallEventType, useDoctorWebSocket } from '../hooks';
import { WebSocketMessage } from '../hooks/useCallSocket';

export interface DoctorWebSocketContextType {
  isOpen: boolean;
  callStatus: DoctorCallEventType | undefined;
  hasIncomingCall: boolean;
  isOngoingCall: boolean;
  message: WebSocketMessage<DoctorCallEventType> | null,
  endCall: () => void;
  declineCall: (note?: string) => void;
  answerCall: () => void;
}

const DoctorWebSocketContext = createContext<DoctorWebSocketContextType>({
  isOpen: false,
  callStatus: undefined,
  hasIncomingCall: false,
  isOngoingCall: false,
  endCall: () => {},
  declineCall: () => {},
  answerCall: () => {},
  message: null,
});

export const useDoctorCommunication = () => useContext(DoctorWebSocketContext);

interface DoctorWebSocketProviderProps {
  children: ReactNode;
  userId: string;
}

export function DoctorCommunicationProvider({
  children,
  userId,
}: DoctorWebSocketProviderProps) {
  const value = useDoctorWebSocket(userId, 'doctor');
  const hasIncomingCall = value.callStatus === DoctorCallEventType.INCOMING;
  const memoisedValue = useMemo(
    () => ({ ...value, hasIncomingCall }),
    [value, hasIncomingCall]
  );
  return (
    <DoctorWebSocketContext.Provider value={memoisedValue}>
      {children}
    </DoctorWebSocketContext.Provider>
  );
}
