import { ReactNode, createContext, useContext, useMemo } from 'react';
import {
  PersonnelCallEventType,
  CallMessage,
  usePersonnelWebSocket,
} from '../hooks';
import { CallLog, WebSocketMessage } from '../hooks/useCallSocket';

export interface PersonnelWebSocketContextType {
  isOpen: boolean;
  isOngoingCall: boolean;
  callStatus: PersonnelCallEventType | undefined;
  callDoctor: (callData: CallMessage) => void;
  endCall: () => void;
  message: WebSocketMessage<PersonnelCallEventType> | null
}

const PersonnelWebSocketContext = createContext<PersonnelWebSocketContextType>({
  isOpen: false,
  isOngoingCall: false,
  callStatus: undefined,
  callDoctor: (callData: CallMessage) => {},
  endCall: () => {},
  message: null,
});

export const usePersonnelCommunication = () =>
  useContext(PersonnelWebSocketContext);

interface PersonnelWebSocketProviderProps {
  children: ReactNode;
  userId: string;
}

export function PersonnelCommunicationProvider({
  children,
  userId,
}: PersonnelWebSocketProviderProps) {
  const value = usePersonnelWebSocket(userId, "health-care-assistant");
  const memoisedValue = useMemo(() => value, [value]);
  return (
    <PersonnelWebSocketContext.Provider value={memoisedValue}>
      {children}
    </PersonnelWebSocketContext.Provider>
  );
}
