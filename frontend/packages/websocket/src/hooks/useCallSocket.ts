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
  name: EventType;
  data: CallLog | undefined;
};

export enum MessageType {
  END_CALL = 'END-CALL',
  DECLINE_CALL = 'DECLINE-CALL',
  ANSWER_CALL = 'ANSWER-CALL',
  CALL_DOCTOR = 'CALL-DOCTOR',
}

// TODO: Move this to env later
const WEBSOCKET_URL = 'wss://api.ourwebsocket.com/websocket';

export function useCallSocket<EventType = undefined>(
  handleMessageReceived: (message: WebSocketMessage<EventType>) => void
) {
  const { sendJsonMessage, readyState, lastJsonMessage } =
    useWebSocket<WebSocketMessage<EventType> | null>(WEBSOCKET_URL, {
      onMessage: (event: WebSocketEventMap['message']) => {
        const message: WebSocketMessage<EventType> = JSON.parse(event.data);
        handleMessageReceived(message);
      },
    });

  const currentCallLog = lastJsonMessage?.data;

  const sendMessage = useCallback(
    <OthersType = undefined>(type: MessageType, others?: OthersType) => {
      sendJsonMessage({ callLog: currentCallLog, type, ...others });
    },
    [currentCallLog]
  );

  return {
    isOpen: readyState === 1,
    isConnecting: readyState === 0,
    currentCallLog,
    sendMessage,
  };
}
