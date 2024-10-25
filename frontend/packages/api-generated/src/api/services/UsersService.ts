/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrentUser } from '../models/CurrentUser';
import type { Doctor } from '../models/Doctor';
import type { User } from '../models/User';
import type { UserSearch } from '../models/UserSearch';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
  /**
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static usersList(
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<User>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/',
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param data
   * @returns User
   * @throws ApiError
   */
  public static usersCreate(data: User): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/users/',
      body: data,
    });
  }
  /**
   * Authenticated user password reset
   * @param data
   * @returns any
   * @throws ApiError
   */
  public static usersChangePassword(data: {
    current_password: string;
    new_password: string;
  }): CancelablePromise<{
    current_password: string;
    new_password: string;
  }> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/users/change_password/',
      body: data,
    });
  }
  /**
   * Retrieve the current logged-in user's information
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns CurrentUser
   * @throws ApiError
   */
  public static usersCurrentUser(
    page?: number,
    size?: number
  ): CancelablePromise<CurrentUser> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/current_user/',
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static usersDoctorsList(
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<Doctor>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/doctors/',
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param id A UUID string identifying this user.
   * @returns Doctor
   * @throws ApiError
   */
  public static usersDoctorsRead(id: string): CancelablePromise<Doctor> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/doctors/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * Forget password endpoint
   * @param data
   * @returns any
   * @throws ApiError
   */
  public static usersForgetPassword(data: {
    /**
     * Username, email, or phone number
     */
    identifier: string;
  }): CancelablePromise<{
    /**
     * Username, email, or phone number
     */
    identifier: string;
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/users/forget_password/',
      body: data,
    });
  }
  /**
   * OTP validation for password reset
   * @param data
   * @returns any
   * @throws ApiError
   */
  public static usersOtpValidation(data: {
    /**
     * OTP sent to user
     */
    otp: string;
  }): CancelablePromise<{
    /**
     * OTP sent to user
     */
    otp: string;
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/users/otp_validation/',
      body: data,
    });
  }
  /**
   * Change user password
   * @param data
   * @returns any
   * @throws ApiError
   */
  public static usersPasswordResetChange(data: {
    /**
     * New password
     */
    new_password: string;
  }): CancelablePromise<{
    /**
     * New password
     */
    new_password: string;
  }> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/users/password_reset_change/',
      body: data,
    });
  }
  /**
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static usersPersonnelsList(
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<UserSearch>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/personnels/',
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param id A UUID string identifying this user.
   * @returns UserSearch
   * @throws ApiError
   */
  public static usersPersonnelsRead(id: string): CancelablePromise<UserSearch> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/personnels/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A UUID string identifying this user.
   * @returns User
   * @throws ApiError
   */
  public static usersRead(id: string): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A UUID string identifying this user.
   * @param data
   * @returns User
   * @throws ApiError
   */
  public static usersUpdate(id: string, data: User): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/users/{id}/',
      path: {
        id: id,
      },
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this user.
   * @param data
   * @returns User
   * @throws ApiError
   */
  public static usersPartialUpdate(
    id: string,
    data: User
  ): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/users/{id}/',
      path: {
        id: id,
      },
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this user.
   * @returns void
   * @throws ApiError
   */
  public static usersDelete(id: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/users/{id}/',
      path: {
        id: id,
      },
    });
  }
}
