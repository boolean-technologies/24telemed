import { useCallback, useState } from 'react';
import { MessageType, WebSocketMessage, useCallSocket } from './useWebsocket';

export enum DoctorCallEventType {
  INCOMING = 'incoming',
  ENDED = 'ended',
  ANSWERED = 'answered',
  DECLINED = 'declined',
}

export function useDoctorWebSocket() {
  const [callStatus, setCallStatus] = useState<DoctorCallEventType>();

  // Function to handle incoming messages
  const handleMessageReceived = useCallback(
    (message: WebSocketMessage<DoctorCallEventType>) => {
      if (message.name === DoctorCallEventType.INCOMING) {
        setCallStatus(DoctorCallEventType.INCOMING);
      }
    },
    []
  );

  const {
    isOpen,
    sendMessage,
    currentCallLog: callLog,
  } = useCallSocket<DoctorCallEventType>(handleMessageReceived);

  // Function to send messages
  const declineCall = useCallback(
    (note?: string) => {
      setCallStatus(DoctorCallEventType.DECLINED);
      sendMessage(MessageType.DECLINE_CALL, { note });
    },
    [sendMessage]
  );

  const answerCall = useCallback(() => {
    setCallStatus(DoctorCallEventType.ANSWERED);
    sendMessage(MessageType.ANSWER_CALL);
  }, [sendMessage]);

  const endCall = useCallback(() => {
    setCallStatus(DoctorCallEventType.ENDED);
    sendMessage(MessageType.END_CALL);
  }, [sendMessage]);

  return {
    isOpen,
    callStatus,
    callLog,
    declineCall,
    answerCall,
    endCall,
  };
}
