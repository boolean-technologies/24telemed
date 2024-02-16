import { useCallback } from 'react';
import useWebSocket from 'react-use-websocket';

export type CallLog = {
  id: string;
  doctorId: string;
  personnelId: string;
  note: string;
  status: 'Initiated' | 'In-Progress' | 'Completed';
};

export type WebSocketMessage<EventType> = {
  type: EventType;
  data: CallLog | undefined;
};

export enum MessageType {
  END_CALL = 'NOTIFY-SERVER-END-CALL',
  DECLINE_CALL = 'NOTIFY-SERVER-DECLINE-CALL',
  ANSWER_CALL = 'NOTIFY-SERVER-ANSWER-CALL',
  CALL_DOCTOR = 'NOTIFY-SERVER-CALL-A-DOCTOR',
  DOCTOR_BUSY = 'NOTIFY-SERVER-DOCTOR-IS-BUSY'
}

export type UserType = "doctor" | "health-care-assistant";

// TODO: Move this to env later
const WEBSOCKET_URL = 'ws://localhost:8000/video_call/';

export function useCallSocket<EventType = undefined>(
  handleMessageReceived: (message: WebSocketMessage<EventType>) => void,
  userId: string,
  type: UserType,
) {
  const { sendJsonMessage, readyState, lastJsonMessage } =
    useWebSocket<WebSocketMessage<EventType> | null>(WEBSOCKET_URL, {
      queryParams: { userId, type },
      onMessage: (event: WebSocketEventMap['message']) => {
        const message: WebSocketMessage<EventType> = JSON.parse(event.data);
        handleMessageReceived(message);
      },
      shouldReconnect: (_) => true
    });

  const currentCallLog = lastJsonMessage?.data;

  const sendMessage = useCallback(
    <OthersType = undefined>(type: MessageType, others?: OthersType) => {
      sendJsonMessage({ data: currentCallLog, type, ...others });
    },
    [currentCallLog]
  );

  return {
    isOpen: readyState === 1,
    isConnecting: readyState === 0,
    message: lastJsonMessage,
    sendMessage,
  };
}