/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Wallet = {
  readonly id?: string;
  readonly call_session?: number;
  readonly call_unit_cost?: number;
  balance?: number | null;
  currency?: string;
  status?: Wallet.status;
  readonly created_at?: string;
  readonly updated_at?: string;
  user: string;
};
export namespace Wallet {
  export enum status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
  }
}
