import { ReactNode, createContext, useContext, useMemo } from 'react';
import {
  PersonnelCallEventType,
  CallMessage,
  usePersonnelWebSocket,
} from '../hooks';
import { CallLog } from '../hooks/useCallSocket';

export interface PersonnelWebSocketContextType {
  isOpen: boolean;
  callStatus: PersonnelCallEventType | undefined;
  callLog: CallLog | undefined;
  callDoctor: (callData: CallMessage) => void;
  endCall: () => void;
}

const PersonnelWebSocketContext = createContext<PersonnelWebSocketContextType>({
  isOpen: false,
  callStatus: undefined,
  callLog: undefined,
  callDoctor: (callData: CallMessage) => {},
  endCall: () => {},
});

export const usePersonnelCommunication = () =>
  useContext(PersonnelWebSocketContext);

interface PersonnelWebSocketProviderProps {
  children: ReactNode;
}

export function PersonnelCommunicationProvider({
  children,
}: PersonnelWebSocketProviderProps) {
  const value = usePersonnelWebSocket();
  const memoisedValue = useMemo(() => value, [value]);
  return (
    <PersonnelWebSocketContext.Provider value={memoisedValue}>
      {children}
    </PersonnelWebSocketContext.Provider>
  );
}
