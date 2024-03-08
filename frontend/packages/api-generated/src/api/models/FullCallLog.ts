/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserSearch } from './UserSearch';
export type FullCallLog = {
  readonly id?: string;
  health_care_assistant: UserSearch;
  doctor: UserSearch;
  readonly start_time?: string;
  end_time?: string | null;
  status?: FullCallLog.status;
  call_type?: FullCallLog.call_type;
  notes?: string | null;
  duration?: number | null;
  call_data?: any;
  priority?: FullCallLog.priority;
  readonly created_at?: string;
  readonly updated_at?: string;
};
export namespace FullCallLog {
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
