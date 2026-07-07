import type { CallLog } from '@/api';

/**
 * Wire protocol shared with the Django Channels consumer
 * (backend/server/call_log/consumer.py). Kept byte-for-byte compatible with the
 * web client so the same backend serves mobile and web.
 */

export type WebSocketMessage<EventType> = {
  type: EventType;
  data: CallLog | string[] | undefined;
  note?: string | null;
};

/** Outbound message names (client -> server). */
export enum MessageType {
  END_CALL = 'NOTIFY-SERVER-END-CALL',
  DECLINE_CALL = 'NOTIFY-SERVER-DECLINE-CALL',
  ANSWER_CALL = 'NOTIFY-SERVER-ANSWER-CALL',
  CALL_DOCTOR = 'NOTIFY-SERVER-CALL-A-DOCTOR',
  DOCTOR_BUSY = 'NOTIFY-SERVER-DOCTOR-IS-BUSY',
}

export type UserType = 'doctor' | 'health-care-assistant';

/** Inbound event names the personnel client reacts to (server -> client). */
export enum PersonnelCallEventType {
  CALLING = 'CALLING-DOCTOR',
  BUSY = 'NOTIFY_PERSONNEL_CLIENT_DOCTOR_IS_BUSY',
  FAILED = 'failed',
  DECLINED = 'NOTIFY_PERSONNEL_CLIENT_DOCTOR_DECLINED_CALL',
  ENDED = 'NOTIFY_PERSONNEL_CLIENT_DOCTOR_ENDED_CALL',
  ANSWERED = 'NOTIFY_PERSONNEL_CLIENT_DOCTOR_ANSWERED_CALL',
  AVAILABLE_DOCTORS = 'AVAILABLE_DOCTORS',
}

/** Inbound event names the doctor client reacts to (server -> client). */
export enum DoctorCallEventType {
  INCOMING = 'NOTIFY_DOCTOR_CLIENT_INCOMING_CALL',
  ENDED = 'ended',
  ENDED_REMOTELY = 'NOTIFY_PERSONNEL_CLIENT_DOCTOR_ENDED_CALL',
  ANSWERED = 'answered',
  DECLINED = 'declined',
}

/** Payload personnel sends to ring a doctor. */
export type CallMessage = {
  doctorId: string;
  patientId: string;
  note: string;
  priority: number;
  /** e_consultation | second_opinion | nursing_visit (stored on the CallLog). */
  consultationType?: string;
};
