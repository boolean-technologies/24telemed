import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'expo-router';
import { useCallSocket } from './useCallSocket';
import {
  CallMessage,
  MessageType,
  PersonnelCallEventType,
  type WebSocketMessage,
} from './messages';

type PersonnelCallContextType = {
  isOpen: boolean;
  isOngoingCall: boolean;
  callStatus: PersonnelCallEventType | undefined;
  /** ids of doctors currently connected/online. */
  availableDoctors: string[];
  callDoctor: (callData: CallMessage) => void;
  endCall: (send?: boolean) => void;
  resetCall: () => void;
  message: WebSocketMessage<PersonnelCallEventType> | null;
};

const PersonnelCallContext = createContext<PersonnelCallContextType | undefined>(
  undefined
);

export const usePersonnelCall = () => {
  const ctx = useContext(PersonnelCallContext);
  if (!ctx)
    throw new Error('usePersonnelCall must be used within PersonnelCallProvider');
  return ctx;
};

export function PersonnelCallProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<PersonnelCallEventType>();

  const handleMessageReceived = useCallback(
    (message: WebSocketMessage<PersonnelCallEventType>) => {
      switch (message.type) {
        case PersonnelCallEventType.BUSY:
          setCallStatus(PersonnelCallEventType.BUSY);
          break;
        case PersonnelCallEventType.DECLINED:
          setCallStatus(PersonnelCallEventType.DECLINED);
          break;
        case PersonnelCallEventType.FAILED:
          setCallStatus(PersonnelCallEventType.FAILED);
          break;
        case PersonnelCallEventType.ENDED:
          setCallStatus(PersonnelCallEventType.ENDED);
          break;
        case PersonnelCallEventType.ANSWERED: {
          setCallStatus(PersonnelCallEventType.ANSWERED);
          const id = (message?.data as { id?: string })?.id;
          if (id) router.push(`/(patient)/meeting/${id}`);
          break;
        }
      }
    },
    [router]
  );

  const { isOpen, sendMessage, message, availableDoctors } = useCallSocket(
    handleMessageReceived,
    userId,
    'health-care-assistant'
  );

  const callDoctor = useCallback(
    (callData: CallMessage) => {
      setCallStatus(PersonnelCallEventType.CALLING);
      sendMessage<{ data: CallMessage }>(MessageType.CALL_DOCTOR, {
        data: callData,
      });
    },
    [sendMessage]
  );

  const endCall = useCallback(
    (send = true) => {
      setCallStatus(PersonnelCallEventType.ENDED);
      if (send) sendMessage(MessageType.END_CALL);
    },
    [sendMessage]
  );

  const resetCall = useCallback(() => setCallStatus(undefined), []);

  const value = useMemo<PersonnelCallContextType>(
    () => ({
      isOpen,
      isOngoingCall: callStatus === PersonnelCallEventType.ANSWERED,
      callStatus,
      availableDoctors,
      callDoctor,
      endCall,
      resetCall,
      message,
    }),
    [isOpen, callStatus, availableDoctors, callDoctor, endCall, resetCall, message]
  );

  return (
    <PersonnelCallContext.Provider value={value}>
      {children}
    </PersonnelCallContext.Provider>
  );
}
