/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CallLog = {
  readonly id?: string;
  readonly duration_limit?: number;
  readonly start_time?: string;
  end_time?: string | null;
  status?: CallLog.status;
  call_type?: CallLog.call_type;
  meeting_id?: string | null;
  notes?: string | null;
  duration?: number | null;
  call_data?: any;
  priority?: CallLog.priority;
  readonly created_at?: string;
  readonly updated_at?: string;
  decline_note?: string | null;
  health_care_assistant: string;
  doctor: string;
  patient?: string | null;
  medical_encounter?: string | null;
};
export namespace CallLog {
  export enum status {
    INITIATED = 'Initiated',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
    DECLINED = 'Declined',
    FAILED = 'Failed',
    BUSY = 'Busy',
  }
  export enum call_type {
    VIDEO = 'Video',
    AUDIO = 'Audio',
  }
  export enum priority {
    _4 = '4',
    _3 = '3',
    _2 = '2',
    _1 = '1',
  }
}
