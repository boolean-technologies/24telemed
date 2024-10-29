import { useCallback, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { CallLog, TOKEN_KEY } from "@local/api-generated";
import { useQueryClient } from '@tanstack/react-query';



export type WebSocketMessage<EventType> = {
  type: EventType;
  data: CallLog | string[] | undefined;
  note?: string | null
};

export enum MessageType {
  END_CALL = 'NOTIFY-SERVER-END-CALL',
  DECLINE_CALL = 'NOTIFY-SERVER-DECLINE-CALL',
  ANSWER_CALL = 'NOTIFY-SERVER-ANSWER-CALL',
  CALL_DOCTOR = 'NOTIFY-SERVER-CALL-A-DOCTOR',
  DOCTOR_BUSY = 'NOTIFY-SERVER-DOCTOR-IS-BUSY'
}

export type UserType = "doctor" | "health-care-assistant";

const WEBSOCKET_URL = 'http://127.0.0.1:8000/video_call/'

export function useCallSocket<EventType = undefined>(
  handleMessageReceived: (message: WebSocketMessage<EventType>) => void,
  userId: string,
  type: UserType,
) {
  const queryClient = useQueryClient();

  const [currentCallLog, setCurrentCallLog] = useState<WebSocketMessage<EventType> | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<string[]>([]);

  const { sendJsonMessage, readyState } =
    useWebSocket<WebSocketMessage<EventType> | null>(WEBSOCKET_URL, {
      queryParams: { userId, type, token: localStorage.getItem(TOKEN_KEY) || "" },
      onMessage: (event: WebSocketEventMap['message']) => {
        const message: WebSocketMessage<EventType> = JSON.parse(event.data);
        handleMessageReceived(message);
        if ((message?.data || {}).hasOwnProperty('meeting_id')) {
          setCurrentCallLog(message);
        } else if (Array.isArray(message?.data)) {
          setAvailableDoctors(message?.data);
        }
        queryClient.invalidateQueries({ queryKey: ["callLogs"]});
      },
      shouldReconnect: (_) => true
    });


  const sendMessage = useCallback(
    <OthersType = undefined>(type: MessageType, others?: OthersType) => {
      sendJsonMessage({ data: currentCallLog?.data, type, ...others });
    },
    [currentCallLog]
  );

  return {
    sendMessage,
    isOpen: readyState === 1,
    isConnecting: readyState === 0,
    message: currentCallLog,
    availableDoctors
  };
}