import { useCallback, useState } from 'react';
import { useNavigate } from "react-router-dom";
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
}

export type CallMessage = {
  doctorId: string;
  patientId: string;
  note: string;
  priority: number;
};

export function usePersonnelWebSocket(userId: string, type: UserType) {
  const navigate = useNavigate();
  const [callStatus, setCallStatus] = useState<PersonnelCallEventType>();
  // Function to handle incoming messages
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
        case PersonnelCallEventType.ANSWERED:
          setCallStatus(PersonnelCallEventType.ANSWERED);

          navigate("/meeting/"+(message?.data as { id: string })?.id)
          break;
      }
    },
    [setCallStatus, navigate]
  );

  const { isOpen, sendMessage, message, availableDoctors } = useCallSocket(
    handleMessageReceived,
    userId,
    type
  );

  const callDoctor = useCallback(
    (callData: CallMessage) => {
      setCallStatus(PersonnelCallEventType.CALLING);
      sendMessage<{ data: CallMessage }>(MessageType.CALL_DOCTOR, {
        data: callData,
      });
    },
    [sendMessage, setCallStatus]
  );

  const endCall = useCallback(
    (send = true) => {
      setCallStatus(PersonnelCallEventType.ENDED);
      if (send) sendMessage(MessageType.END_CALL);
    },
    [sendMessage, setCallStatus]
  );

  const isOngoingCall = callStatus === PersonnelCallEventType.ANSWERED;

  return {
    isOpen,
    callStatus,
    message,
    availableDoctors,
    isOngoingCall,
    callDoctor,
    endCall,
  };
}
