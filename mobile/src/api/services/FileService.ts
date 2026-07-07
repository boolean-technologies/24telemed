/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { File } from '../models/File';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FileService {
  /**
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static fileList(
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<File>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/file/',
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * @param data
   * @returns File
   * @throws ApiError
   */
  public static fileCreate(data: File): CancelablePromise<File> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/file/',
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this file.
   * @returns File
   * @throws ApiError
   */
  public static fileRead(id: string): CancelablePromise<File> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/file/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A UUID string identifying this file.
   * @param data
   * @returns File
   * @throws ApiError
   */
  public static fileUpdate(id: string, data: File): CancelablePromise<File> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/file/{id}/',
      path: {
        id: id,
      },
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this file.
   * @param data
   * @returns File
   * @throws ApiError
   */
  public static filePartialUpdate(
    id: string,
    data: File
  ): CancelablePromise<File> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/file/{id}/',
      path: {
        id: id,
      },
      body: data,
    });
  }
  /**
   * @param id A UUID string identifying this file.
   * @returns void
   * @throws ApiError
   */
  public static fileDelete(id: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/file/{id}/',
      path: {
        id: id,
      },
    });
  }
}
