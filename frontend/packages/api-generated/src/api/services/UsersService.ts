/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
    results: Array<UserSearch>;
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
   * @returns UserSearch
   * @throws ApiError
   */
  public static usersDoctorsRead(id: string): CancelablePromise<UserSearch> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/users/doctors/{id}/',
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
