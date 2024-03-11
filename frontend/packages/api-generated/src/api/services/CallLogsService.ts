/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CallLog } from '../models/CallLog';
import type { CallStats } from '../models/CallStats';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CallLogsService {
  /**
   * @param status status
   * @param callType call_type
   * @param notesIcontains notes__icontains
   * @param order Ordering
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static callLogsList(
    status?:
      | 'Initiated'
      | 'In Progress'
      | 'Completed'
      | 'Declined'
      | 'Failed'
      | 'Busy',
    callType?: 'Video' | 'Audio',
    notesIcontains?: string,
    order?:
      | 'start_time'
      | '-start_time'
      | 'created_at'
      | '-created_at'
      | 'priority'
      | '-priority',
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<CallLog>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/call-logs/',
      query: {
        status: status,
        call_type: callType,
        notes__icontains: notesIcontains,
        order: order,
        page: page,
        size: size,
      },
    });
  }
  /**
   * Retrieve the call-log statistics
   * @param status status
   * @param callType call_type
   * @param notesIcontains notes__icontains
   * @param order Ordering
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns CallStats
   * @throws ApiError
   */
  public static callLogsCallStats(
    status?:
      | 'Initiated'
      | 'In Progress'
      | 'Completed'
      | 'Declined'
      | 'Failed'
      | 'Busy',
    callType?: 'Video' | 'Audio',
    notesIcontains?: string,
    order?:
      | 'start_time'
      | '-start_time'
      | 'created_at'
      | '-created_at'
      | 'priority'
      | '-priority',
    page?: number,
    size?: number
  ): CancelablePromise<CallStats> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/call-logs/call_stats/',
      query: {
        status: status,
        call_type: callType,
        notes__icontains: notesIcontains,
        order: order,
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param id A UUID string identifying this call log.
   * @returns CallLog
   * @throws ApiError
   */
  public static callLogsRead(id: string): CancelablePromise<CallLog> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/call-logs/{id}/',
      path: {
        id: id,
      },
    });
  }
}
