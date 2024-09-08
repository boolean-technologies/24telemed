/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Transaction } from '../models/Transaction';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WalletService {
  /**
   * @param page A page number within the paginated result set.
   * @param size Number of results to return per page.
   * @returns any
   * @throws ApiError
   */
  public static walletTransactionsList(
    page?: number,
    size?: number
  ): CancelablePromise<{
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<Transaction>;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/wallet/transactions/',
      query: {
        page: page,
        size: size,
      },
    });
  }
  /**
   * @returns any
   * @throws ApiError
   */
  public static walletWebhookFlutterwaveCreate(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/wallet/webhook/flutterwave/',
    });
  }
}
