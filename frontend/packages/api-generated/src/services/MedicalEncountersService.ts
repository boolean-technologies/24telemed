/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Drug } from '../models/Drug';
import type { MedicalEncounter } from '../models/MedicalEncounter';
import type { PrescribedDrug } from '../models/PrescribedDrug';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MedicalEncountersService {
  /**
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static medicalEncountersDoctorMedicalEncountersList(
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
      url: '/medical-encounters/doctor-medical-encounters/',
      query: {
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
  public static medicalEncountersDoctorMedicalEncountersCreate(
    data: MedicalEncounter
  ): CancelablePromise<MedicalEncounter> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/medical-encounters/doctor-medical-encounters/',
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this medical encounter.
   * @returns MedicalEncounter
   * @throws ApiError
   */
  public static medicalEncountersDoctorMedicalEncountersRead(
    id: string
  ): CancelablePromise<MedicalEncounter> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/medical-encounters/doctor-medical-encounters/{id}/',
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
  public static medicalEncountersDoctorMedicalEncountersUpdate(
    id: string,
    data: MedicalEncounter
  ): CancelablePromise<MedicalEncounter> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/medical-encounters/doctor-medical-encounters/{id}/',
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
  public static medicalEncountersDoctorMedicalEncountersPartialUpdate(
    id: string,
    data: MedicalEncounter
  ): CancelablePromise<MedicalEncounter> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/medical-encounters/doctor-medical-encounters/{id}/',
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
  public static medicalEncountersDoctorMedicalEncountersDelete(
    id: string
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/medical-encounters/doctor-medical-encounters/{id}/',
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
  public static medicalEncountersDoctorPrescribedDrugsList(
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
      url: '/medical-encounters/doctor-prescribed-drugs/',
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
  public static medicalEncountersDoctorPrescribedDrugsCreate(
    data: PrescribedDrug
  ): CancelablePromise<PrescribedDrug> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/medical-encounters/doctor-prescribed-drugs/',
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this prescribed drug.
   * @returns PrescribedDrug
   * @throws ApiError
   */
  public static medicalEncountersDoctorPrescribedDrugsRead(
    id: string
  ): CancelablePromise<PrescribedDrug> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/medical-encounters/doctor-prescribed-drugs/{id}/',
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
  public static medicalEncountersDoctorPrescribedDrugsUpdate(
    id: string,
    data: PrescribedDrug
  ): CancelablePromise<PrescribedDrug> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/medical-encounters/doctor-prescribed-drugs/{id}/',
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
  public static medicalEncountersDoctorPrescribedDrugsPartialUpdate(
    id: string,
    data: PrescribedDrug
  ): CancelablePromise<PrescribedDrug> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/medical-encounters/doctor-prescribed-drugs/{id}/',
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
  public static medicalEncountersDoctorPrescribedDrugsDelete(
    id: string
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/medical-encounters/doctor-prescribed-drugs/{id}/',
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
  public static medicalEncountersDrugsList(
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
      url: '/medical-encounters/drugs/',
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
  public static medicalEncountersDrugsRead(
    id: string
  ): CancelablePromise<Drug> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/medical-encounters/drugs/{id}/',
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
  public static medicalEncountersPersonnelMedicalEncountersList(
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
      url: '/medical-encounters/personnel-medical-encounters/',
      query: {
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
  public static medicalEncountersPersonnelMedicalEncountersRead(
    id: string
  ): CancelablePromise<MedicalEncounter> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/medical-encounters/personnel-medical-encounters/{id}/',
      path: {
        id: id,
      },
    });
  }
}
