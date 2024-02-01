import { useCallback, useState } from 'react';
import {
  type WebSocketMessage,
  useCallSocket,
  MessageType,
} from './useCallSocket';

export enum PersonnelCallEventType {
  CALLING = 'calling',
  BUSY = 'busy',
  FAILED = 'failed',
  DECLINED = 'declined',
  ENDED = 'ended',
  ANSWERED = 'answered',
};

export type CallMessage = {
  doctorId: string;
  note: string;
  priority: number;
};

export function usePersonnelWebSocket() {
  const [callStatus, setCallStatus] = useState<PersonnelCallEventType>();
  // Function to handle incoming messages
  const handleMessageReceived = useCallback(
    (message: WebSocketMessage<PersonnelCallEventType>) => {
      switch (message.name) {
        case PersonnelCallEventType.BUSY:
          setCallStatus(PersonnelCallEventType.BUSY);
        case PersonnelCallEventType.DECLINED:
          setCallStatus(PersonnelCallEventType.DECLINED);
        case PersonnelCallEventType.FAILED:
          setCallStatus(PersonnelCallEventType.FAILED);
        case PersonnelCallEventType.ENDED:
          setCallStatus(PersonnelCallEventType.ENDED);
        case PersonnelCallEventType.ANSWERED:
          setCallStatus(PersonnelCallEventType.ANSWERED);
      }
    },
    [setCallStatus]
  );

  const { isOpen, sendMessage, currentCallLog: callLog } = useCallSocket(handleMessageReceived);

  const callDoctor = useCallback(
    (callData: CallMessage) => {
      setCallStatus(PersonnelCallEventType.CALLING);
      sendMessage<CallMessage>(MessageType.CALL_DOCTOR, callData)
    },
    [sendMessage, setCallStatus]
  );

  const endCall = useCallback(
    () => {
      setCallStatus(PersonnelCallEventType.ENDED);
      sendMessage(MessageType.END_CALL);
    },
    [sendMessage, setCallStatus]
  );

  return {
    isOpen,
    callStatus,
    callLog,
    callDoctor,
    endCall,
  };
}
