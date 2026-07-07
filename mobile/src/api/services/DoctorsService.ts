/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CallStats } from '../models/CallStats';
import type { Drug } from '../models/Drug';
import type { FullCallLog } from '../models/FullCallLog';
import type { MedicalEncounter } from '../models/MedicalEncounter';
import type { PrescribedDrug } from '../models/PrescribedDrug';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorsService {
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
  public static doctorsCallLogsList(
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
    results: Array<FullCallLog>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doctors/call-logs/',
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
  public static doctorsCallLogsCallStats(
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
      url: '/doctors/call-logs/call_stats/',
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
   * @returns FullCallLog
   * @throws ApiError
   */
  public static doctorsCallLogsRead(
    id: string
  ): CancelablePromise<FullCallLog> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doctors/call-logs/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param patient patient
   * @param ordering Which field to use when ordering the results.
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorMedicalEncountersList(
    patient?: string,
    ordering?: string,
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<MedicalEncounter>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doctors/medical-encounters/doctor-medical-encounters/',
      query: {
        patient: patient,
        ordering: ordering,
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param data
   * @returns MedicalEncounter
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorMedicalEncountersCreate(
    data: MedicalEncounter
  ): CancelablePromise<MedicalEncounter> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/doctors/medical-encounters/doctor-medical-encounters/',
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this medical encounter.
   * @returns MedicalEncounter
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorMedicalEncountersRead(
    id: string
  ): CancelablePromise<MedicalEncounter> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doctors/medical-encounters/doctor-medical-encounters/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A UUID string identifying this medical encounter.
   * @param data
   * @returns MedicalEncounter
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorMedicalEncountersUpdate(
    id: string,
    data: MedicalEncounter
  ): CancelablePromise<MedicalEncounter> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/doctors/medical-encounters/doctor-medical-encounters/{id}/',
      path: {
        id: id,
      },
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this medical encounter.
   * @param data
   * @returns MedicalEncounter
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorMedicalEncountersPartialUpdate(
    id: string,
    data: MedicalEncounter
  ): CancelablePromise<MedicalEncounter> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/doctors/medical-encounters/doctor-medical-encounters/{id}/',
      path: {
        id: id,
      },
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this medical encounter.
   * @returns void
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorMedicalEncountersDelete(
    id: string
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/doctors/medical-encounters/doctor-medical-encounters/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorPrescribedDrugsList(
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<PrescribedDrug>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doctors/medical-encounters/doctor-prescribed-drugs/',
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param data
   * @returns PrescribedDrug
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorPrescribedDrugsCreate(
    data: PrescribedDrug
  ): CancelablePromise<PrescribedDrug> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/doctors/medical-encounters/doctor-prescribed-drugs/',
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this prescribed drug.
   * @returns PrescribedDrug
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorPrescribedDrugsRead(
    id: string
  ): CancelablePromise<PrescribedDrug> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doctors/medical-encounters/doctor-prescribed-drugs/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A UUID string identifying this prescribed drug.
   * @param data
   * @returns PrescribedDrug
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorPrescribedDrugsUpdate(
    id: string,
    data: PrescribedDrug
  ): CancelablePromise<PrescribedDrug> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/doctors/medical-encounters/doctor-prescribed-drugs/{id}/',
      path: {
        id: id,
      },
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this prescribed drug.
   * @param data
   * @returns PrescribedDrug
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorPrescribedDrugsPartialUpdate(
    id: string,
    data: PrescribedDrug
  ): CancelablePromise<PrescribedDrug> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/doctors/medical-encounters/doctor-prescribed-drugs/{id}/',
      path: {
        id: id,
      },
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this prescribed drug.
   * @returns void
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDoctorPrescribedDrugsDelete(
    id: string
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/doctors/medical-encounters/doctor-prescribed-drugs/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDrugsList(
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<Drug>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doctors/medical-encounters/drugs/',
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param id A UUID string identifying this drug.
   * @returns Drug
   * @throws ApiError
   */
  public static doctorsMedicalEncountersDrugsRead(
    id: string
  ): CancelablePromise<Drug> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doctors/medical-encounters/drugs/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param patient patient
   * @param ordering Which field to use when ordering the results.
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static doctorsMedicalEncountersPersonnelMedicalEncountersList(
    patient?: string,
    ordering?: string,
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<MedicalEncounter>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doctors/medical-encounters/personnel-medical-encounters/',
      query: {
        patient: patient,
        ordering: ordering,
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param id A UUID string identifying this medical encounter.
   * @returns MedicalEncounter
   * @throws ApiError
   */
  public static doctorsMedicalEncountersPersonnelMedicalEncountersRead(
    id: string
  ): CancelablePromise<MedicalEncounter> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doctors/medical-encounters/personnel-medical-encounters/{id}/',
      path: {
        id: id,
      },
    });
  }
}
