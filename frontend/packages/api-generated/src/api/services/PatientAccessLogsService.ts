/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatientAccessLog } from '../models/PatientAccessLog';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientAccessLogsService {
  /**
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static patientAccessLogsList(
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<PatientAccessLog>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/patient-access-logs/',
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param id A UUID string identifying this patient access log.
   * @returns PatientAccessLog
   * @throws ApiError
   */
  public static patientAccessLogsRead(
    id: string
  ): CancelablePromise<PatientAccessLog> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/patient-access-logs/{id}/',
      path: {
        id: id,
      },
    });
  }
}
