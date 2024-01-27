import { ReactNode, createContext, useContext, useMemo } from 'react';
import { DoctorCallEventType, useDoctorWebSocket } from '../hooks';
import { CallLog } from '../hooks/useWebsocket';

export interface DoctorWebSocketContextType {
  isOpen: boolean;
  callStatus: DoctorCallEventType | undefined;
  callLog: CallLog | undefined;
  endCall: () => void;
  declineCall: (note?: string) => void;
  answerCall: () => void;
}

const DoctorWebSocketContext = createContext<DoctorWebSocketContextType>({
  isOpen: false,
  callStatus: undefined,
  callLog: undefined,
  endCall: () => {},
  declineCall: () => {},
  answerCall: () => {},
});

export const useDoctorCommunication = () =>
  useContext(DoctorWebSocketContext);

interface DoctorWebSocketProviderProps {
  children: ReactNode;
}

export function DoctorCommunicationProvider({
  children,
}: DoctorWebSocketProviderProps) {
  const value = useDoctorWebSocket();
  const memoisedValue = useMemo(() => value, [value]);
  return (
    <DoctorWebSocketContext.Provider value={memoisedValue}>
      {children}
    </DoctorWebSocketContext.Provider>
  );
}
