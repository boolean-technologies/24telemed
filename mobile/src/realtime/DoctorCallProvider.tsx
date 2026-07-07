import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import { useCallSocket } from './useCallSocket';
import {
  DoctorCallEventType,
  MessageType,
  type WebSocketMessage,
} from './messages';
import { DoctorsService, type CallLog, type FullCallLog } from '@/api';

type DoctorCallContextType = {
  isOpen: boolean;
  isOngoingCall: boolean;
  callStatus: DoctorCallEventType | undefined;
  /** The incoming/active call payload (CallLog), or null. */
  incomingCall: CallLog | null;
  answerCall: () => void;
  declineCall: (note?: string) => void;
  endCall: () => void;
  resetCall: () => void;
};

const DoctorCallContext = createContext<DoctorCallContextType | undefined>(
  undefined
);

export const useDoctorCall = () => {
  const ctx = useContext(DoctorCallContext);
  if (!ctx)
    throw new Error('useDoctorCall must be used within DoctorCallProvider');
  return ctx;
};

export function DoctorCallProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const [callStatus, setCallStatus] = useState<DoctorCallEventType>();
  const [isBusy, setIsBusy] = useState(false);
  const [restoredCall, setRestoredCall] = useState<CallLog | null>(null);

  const handleMessageReceived = useCallback(
    (message: WebSocketMessage<DoctorCallEventType>) => {
      if (message.type === DoctorCallEventType.INCOMING) {
        // Already on a call -> tell the server we're busy.
        setCallStatus((prev) => {
          if (prev === DoctorCallEventType.ANSWERED) {
            setIsBusy(true);
            return prev;
          }
          return DoctorCallEventType.INCOMING;
        });
      } else if (message.type === DoctorCallEventType.ENDED_REMOTELY) {
        setCallStatus(DoctorCallEventType.ENDED);
      }
    },
    []
  );

  const { isOpen, sendMessage, message } = useCallSocket<DoctorCallEventType>(
    handleMessageReceived,
    userId,
    'doctor'
  );

  const socketCall = (message?.data as CallLog | undefined) ?? null;
  const incomingCall = socketCall ?? restoredCall;

  const declineCall = useCallback(
    (note?: string) => {
      setCallStatus(DoctorCallEventType.DECLINED);
      sendMessage(MessageType.DECLINE_CALL, { data: incomingCall, note });
    },
    [incomingCall, sendMessage]
  );

  const answerCall = useCallback(() => {
    setCallStatus(DoctorCallEventType.ANSWERED);
    sendMessage(MessageType.ANSWER_CALL, { data: incomingCall });
  }, [incomingCall, sendMessage]);

  const endCall = useCallback(() => {
    setCallStatus(DoctorCallEventType.ENDED);
    sendMessage(MessageType.END_CALL, { data: incomingCall });
  }, [incomingCall, sendMessage]);

  const resetCall = useCallback(() => {
    setCallStatus(undefined);
    setRestoredCall(null);
  }, []);

  useEffect(() => {
    if (isBusy) {
      sendMessage(MessageType.DOCTOR_BUSY);
      setIsBusy(false);
    }
  }, [isBusy, sendMessage]);

  const restorePendingCall = useCallback(async () => {
    try {
      const page = await DoctorsService.doctorsCallLogsList(
        'Initiated',
        undefined,
        undefined,
        '-created_at',
        1,
        1
      );
      const pending = page.results[0] as FullCallLog | undefined;
      const createdAt = pending?.created_at
        ? new Date(pending.created_at).getTime()
        : 0;
      if (!pending?.id || Date.now() - createdAt > 90_000) return;

      const normalized = {
        ...pending,
        health_care_assistant: pending.health_care_assistant.id as string,
        doctor: pending.doctor.id as string,
        patient: pending.patient?.id ?? null,
      } as unknown as CallLog;
      setCallStatus((current) => {
        if (
          current === DoctorCallEventType.INCOMING ||
          current === DoctorCallEventType.ANSWERED
        ) {
          return current;
        }
        setRestoredCall(normalized);
        return DoctorCallEventType.INCOMING;
      });
    } catch {
      // The socket remains the primary path; a restore failure is non-fatal.
    }
  }, []);

  useEffect(() => {
    void restorePendingCall();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void restorePendingCall();
    });
    return () => subscription.remove();
  }, [restorePendingCall]);

  const value = useMemo<DoctorCallContextType>(
    () => ({
      isOpen,
      isOngoingCall: callStatus === DoctorCallEventType.ANSWERED,
      callStatus,
      incomingCall,
      answerCall,
      declineCall,
      endCall,
      resetCall,
    }),
    [isOpen, callStatus, incomingCall, answerCall, declineCall, endCall, resetCall]
  );

  return (
    <DoctorCallContext.Provider value={value}>
      {children}
    </DoctorCallContext.Provider>
  );
}
