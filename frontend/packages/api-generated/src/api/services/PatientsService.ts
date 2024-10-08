/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Patient } from '../models/Patient';
import type { PatientSearch } from '../models/PatientSearch';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientsService {
  /**
   * @param data
   * @returns Patient
   * @throws ApiError
   */
  public static patientsCreate(data: Patient): CancelablePromise<Patient> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/patients/',
      body: data,
    });
  }
  /**
   * Search patients by phone number or patient id
   * @param phoneNumber phone_number
   * @param patientId patient_id
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns PatientSearch
   * @throws ApiError
   */
  public static patientsSearch(
    phoneNumber?: string,
    patientId?: string,
    page?: number,
    size?: number
  ): CancelablePromise<Array<PatientSearch>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/patients/search/',
      query: {
        phone_number: phoneNumber,
        patient_id: patientId,
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param id A UUID string identifying this patient.
   * @returns Patient
   * @throws ApiError
   */
  public static patientsRead(id: string): CancelablePromise<Patient> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/patients/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A UUID string identifying this patient.
   * @param data
   * @returns Patient
   * @throws ApiError
   */
  public static patientsUpdate(
    id: string,
    data: Patient
  ): CancelablePromise<Patient> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/patients/{id}/',
      path: {
        id: id,
      },
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this patient.
   * @param data
   * @returns Patient
   * @throws ApiError
   */
  public static patientsPartialUpdate(
    id: string,
    data: Patient
  ): CancelablePromise<Patient> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/patients/{id}/',
      path: {
        id: id,
      },
      body: data,
    });
  }
}
