import { useCallback, useState } from 'react';
import {
  type WebSocketMessage,
  useCallSocket,
  MessageType,
  UserType,
} from './useCallSocket';

export enum PersonnelCallEventType {
  CALLING = 'CALLING-DOCTOR',
  BUSY = 'NOTIFY_PERSONNEL_CLIENT_DOCTOR_IS_BUSY',
  FAILED = 'failed',
  DECLINED = 'NOTIFY_PERSONNEL_CLIENT_DOCTOR_DECLINED_CALL',
  ENDED = 'NOTIFY_PERSONNEL_CLIENT_DOCTOR_ENDED_CALL',
  ANSWERED = 'NOTIFY_PERSONNEL_CLIENT_DOCTOR_ANSWERED_CALL',
  AVAILABLE_DOCTORS = 'AVAILABLE_DOCTORS',
};

export type CallMessage = {
  doctorId: string;
  note: string;
  priority: number;
};

export function usePersonnelWebSocket(userId: string, type: UserType) {
  const [callStatus, setCallStatus] = useState<PersonnelCallEventType>();
  const [callMessage, setCallMessage] = useState<WebSocketMessage<PersonnelCallEventType> | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<string[]>([]);
  // Function to handle incoming messages
  const handleMessageReceived = useCallback(
    (message: WebSocketMessage<PersonnelCallEventType>) => {
      switch (message.type) {
        case PersonnelCallEventType.BUSY:
          setCallStatus(PersonnelCallEventType.BUSY);
          setCallMessage(message)
          break;
        case PersonnelCallEventType.DECLINED:
          setCallStatus(PersonnelCallEventType.DECLINED);
          setCallMessage(message)
          break;
        case PersonnelCallEventType.FAILED:
          setCallStatus(PersonnelCallEventType.FAILED);
          setCallMessage(message)
          break;
        case PersonnelCallEventType.ENDED:
          setCallStatus(PersonnelCallEventType.ENDED);
          setCallMessage(message)
          break;
        case PersonnelCallEventType.ANSWERED:
          setCallStatus(PersonnelCallEventType.ANSWERED);
          setCallMessage(message)
          break;
        case PersonnelCallEventType.AVAILABLE_DOCTORS:
          setAvailableDoctors(message.data as string[]);
          break;
      }
    },
    [setCallStatus]
  );

  const { isOpen, sendMessage, message } = useCallSocket(handleMessageReceived, userId, type);

  const callDoctor = useCallback(
    (callData: CallMessage) => {
      setCallStatus(PersonnelCallEventType.CALLING);
      sendMessage<{ data: CallMessage }>(MessageType.CALL_DOCTOR, { data: callData })
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

  const isOngoingCall = callStatus === PersonnelCallEventType.ANSWERED;

  const currentCallMessage = (message?.data || {}).hasOwnProperty('meeting_id') ? message : callMessage;

  return {
    isOpen,
    callStatus,
    message: currentCallMessage,
    availableDoctors,
    isOngoingCall,
    callDoctor,
    endCall,
  };
}
