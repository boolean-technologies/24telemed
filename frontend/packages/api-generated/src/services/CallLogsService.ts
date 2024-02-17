/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CallLog } from '../models/CallLog';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CallLogsService {
  /**
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static callLogsList(
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
