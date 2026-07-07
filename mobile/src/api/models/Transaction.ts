/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Transaction = {
  readonly id?: string;
  transaction_type: Transaction.transaction_type;
  payment_source?: Transaction.payment_source | null;
  payment_method?: Transaction.payment_method | null;
  payment_reference?: string | null;
  amount?: number | null;
  description?: string | null;
  created_at?: string;
  flw_ref?: string | null;
  order_ref?: string | null;
  status?: Transaction.status;
  wallet: string;
};
export namespace Transaction {
  export enum transaction_type {
    DEPOSIT = 'deposit',
    WITHDRAWAL = 'withdrawal',
    TRANSFER = 'transfer',
  }
  export enum payment_source {
    FLUTTERWAVE = 'flutterwave',
    PAYSTACK = 'paystack',
  }
  export enum payment_method {
    CARD = 'card',
    BANK_TRANSFER = 'bank_transfer',
    USSD = 'ussd',
    MOBILE_MONEY = 'mobile_money',
    BANK = 'bank',
  }
  export enum status {
    PENDING = 'pending',
    SUCCESSFUL = 'successful',
    FAILED = 'failed',
  }
}
