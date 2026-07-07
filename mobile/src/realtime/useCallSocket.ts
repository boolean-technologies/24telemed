import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { env } from '@/config/env';
import { getAccessToken } from '@/auth/storage';
import {
  MessageType,
  type UserType,
  type WebSocketMessage,
} from './messages';

/**
 * Native port of the web `useCallSocket`. Opens a reconnecting WebSocket to the
 * Channels consumer, authenticated via the JWT in the query string (the backend
 * JWTAuthMiddlewareStack reads it there). React Native provides a global
 * `WebSocket`, so no extra dependency is needed.
 */
export function useCallSocket<EventType = undefined>(
  handleMessageReceived: (message: WebSocketMessage<EventType>) => void,
  userId: string,
  type: UserType
) {
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnect = useRef(true);
  const handlerRef = useRef(handleMessageReceived);
  handlerRef.current = handleMessageReceived;

  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentCallLog, setCurrentCallLog] =
    useState<WebSocketMessage<EventType> | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<string[]>([]);

  const connect = useCallback(async () => {
    if (!userId) return;
    setIsConnecting(true);
    const token = (await getAccessToken()) ?? '';
    const params = new URLSearchParams({ userId, type, token });
    const url = `${env.websocketBase}?${params.toString()}`;

    // RN doesn't send an Origin header; supply one the backend's
    // OriginValidator accepts. The 3rd WebSocket arg (options) is RN-only, so
    // we cast to bypass the DOM lib's 2-arg constructor type.
    const ws = env.wsOrigin
      ? new (WebSocket as unknown as {
          new (url: string, protocols: string[] | undefined, options: { headers: Record<string, string> }): WebSocket;
        })(url, undefined, { headers: { Origin: env.wsOrigin } })
      : new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsOpen(true);
      setIsConnecting(false);
    };

    ws.onmessage = (event: WebSocketMessageEvent) => {
      let message: WebSocketMessage<EventType>;
      try {
        message = JSON.parse(event.data as string);
      } catch {
        return;
      }
      handlerRef.current(message);
      if (message?.data && !Array.isArray(message.data)) {
        if (Object.prototype.hasOwnProperty.call(message.data, 'meeting_id')) {
          setCurrentCallLog(message);
        }
      } else if (Array.isArray(message?.data)) {
        setAvailableDoctors(message.data);
      }
      queryClient.invalidateQueries({ queryKey: ['callLogs'] });
    };

    ws.onerror = () => {
      // The close handler drives reconnection.
    };

    ws.onclose = () => {
      setIsOpen(false);
      setIsConnecting(false);
      socketRef.current = null;
      if (shouldReconnect.current) {
        reconnectTimer.current = setTimeout(() => void connect(), 2000);
      }
    };
  }, [userId, type, queryClient]);

  useEffect(() => {
    shouldReconnect.current = true;
    void connect();
    return () => {
      shouldReconnect.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback(
    <OthersType = undefined>(messageType: MessageType, others?: OthersType) => {
      const ws = socketRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      ws.send(
        JSON.stringify({ data: currentCallLog?.data, type: messageType, ...others })
      );
    },
    [currentCallLog]
  );

  return {
    sendMessage,
    isOpen,
    isConnecting,
    message: currentCallLog,
    availableDoctors,
  };
}
