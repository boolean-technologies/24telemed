import { useCallback, useEffect, useState } from 'react';
import { MessageType, UserType, WebSocketMessage, useCallSocket } from './useCallSocket';

export enum DoctorCallEventType {
  INCOMING = 'NOTIFY_DOCTOR_CLIENT_INCOMING_CALL',
  ENDED = 'ended',
  ENDED_REMOTELY = 'NOTIFY_PERSONNEL_CLIENT_DOCTOR_ENDED_CALL',
  ANSWERED = 'answered',
  DECLINED = 'declined',
}

export function useDoctorWebSocket(userId: string, type: UserType) {
  const [callStatus, setCallStatus] = useState<DoctorCallEventType>();
  const [isBusy, setIsBusy] = useState<boolean>(false);

  // Function to handle incoming messages
  const handleMessageReceived = useCallback(
    (message: WebSocketMessage<DoctorCallEventType>) => {
      if (message.type === DoctorCallEventType.INCOMING) {
        if (callStatus === DoctorCallEventType.ANSWERED){
          setIsBusy(true);
        } else {
          setCallStatus(DoctorCallEventType.INCOMING);
        }
      } else if (message.type === DoctorCallEventType.ENDED_REMOTELY) {
        setCallStatus(DoctorCallEventType.ENDED);
      }
    },
    [setCallStatus, setIsBusy]
  );

  const {
    isOpen,
    sendMessage,
    message
  } = useCallSocket<DoctorCallEventType>(handleMessageReceived, userId, type);

  // Function to send messages
  const declineCall = useCallback(
    (note?: string) => {
      setCallStatus(DoctorCallEventType.DECLINED);
      sendMessage(MessageType.DECLINE_CALL, { note });
    },
    [sendMessage, setCallStatus]
  );

  const answerCall = useCallback(() => {
    setCallStatus(DoctorCallEventType.ANSWERED);
    sendMessage(MessageType.ANSWER_CALL);
  }, [sendMessage, setCallStatus]);

  const endCall = useCallback(() => {
    setCallStatus(DoctorCallEventType.ENDED);
    sendMessage(MessageType.END_CALL);
  }, [sendMessage, setCallStatus]);

  useEffect(() => {
    if (isBusy) {
      sendMessage(MessageType.DOCTOR_BUSY);
      setIsBusy(false);
    }
  }, [isBusy])

  const isOngoingCall = callStatus === DoctorCallEventType.ANSWERED;

  return {
    isOpen,
    callStatus,
    message,
    isOngoingCall,
    declineCall,
    answerCall,
    endCall,
  };
}
