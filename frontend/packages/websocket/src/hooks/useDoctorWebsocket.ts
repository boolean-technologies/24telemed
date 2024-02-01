import { useCallback, useEffect, useState } from 'react';
import { MessageType, UserType, WebSocketMessage, useCallSocket } from './useCallSocket';

export enum DoctorCallEventType {
  INCOMING = 'NOTIFY_DOCTOR_CLIENT_INCOMING_CALL',
  ENDED = 'ended',
  ANSWERED = 'answered',
  DECLINED = 'declined',
}

export function useDoctorWebSocket(userId: string, type: UserType) {
  const [callStatus, setCallStatus] = useState<DoctorCallEventType>();
  const [currentMessage, setCurrentMessage] = useState<WebSocketMessage<DoctorCallEventType>>();

  // Function to handle incoming messages
  const handleMessageReceived = useCallback(
    (message: WebSocketMessage<DoctorCallEventType>) => {
      if (message.type === DoctorCallEventType.INCOMING) {
        setCallStatus(DoctorCallEventType.INCOMING);
        setCurrentMessage(message);
      }
    },
    [setCallStatus, setCurrentMessage]
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

  const isOngoingCall = callStatus === DoctorCallEventType.ANSWERED;

  // useEffect(() => {
  //   if (callStatus === DoctorCallEventType.ANSWERED || currentMessage?.type === DoctorCallEventType.INCOMING){
  //     sendMessage(MessageType.DECLINE_CALL, { note: "Busy on another call" })
  //   }
  // }, [callStatus, currentMessage, sendMessage])

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
