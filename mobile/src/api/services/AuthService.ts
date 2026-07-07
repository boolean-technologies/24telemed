/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DoctorTokenObtainPair } from '../models/DoctorTokenObtainPair';
import type { PersonnelTokenObtainPair } from '../models/PersonnelTokenObtainPair';
import type { TokenRefresh } from '../models/TokenRefresh';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
  /**
   * @param data
   * @returns DoctorTokenObtainPair
   * @throws ApiError
   */
  public static authTokenDoctorCreate(
    data: DoctorTokenObtainPair
  ): CancelablePromise<DoctorTokenObtainPair> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/token/doctor/',
      body: data,
    });
  }
  /**
   * @param data
   * @returns PersonnelTokenObtainPair
   * @throws ApiError
   */
  public static authTokenPersonnelCreate(
    data: PersonnelTokenObtainPair
  ): CancelablePromise<PersonnelTokenObtainPair> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/token/personnel/',
      body: data,
    });
  }
  /**
   * Takes a refresh type JSON web token and returns an access type JSON web
   * token if the refresh token is valid.
   * @param data
   * @returns TokenRefresh
   * @throws ApiError
   */
  public static authTokenRefreshCreate(
    data: TokenRefresh
  ): CancelablePromise<TokenRefresh> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/auth/token/refresh/',
      body: data,
    });
  }
}
