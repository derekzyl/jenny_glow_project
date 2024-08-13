import { BvnResponseDataType } from '@modules/flutterwave/interfaces/interface.accounts.flutterwave';

/**
 * The above interface represents the response data structure for creating a new account.
 */
export interface ICreateVirtualAccountResponseData {
  response_code: string;
  response_message: string;
  flw_ref: string;
  order_ref: string;
  account_number: string;
  frequency: string;
  bank_name: string;
  created_at: Date;
  expiry_date: string;
  note: string;
  amount: string;
}

/**
 * The `CreateVirtualBulkAccountResponseType` interface represents the response data structure for creating
 * multiple accounts in bulk.
 */
export interface ICreateVirtualBulkAccountResponseData {
  batch_id: string;
  response_code: string;
  response_message: string;
}

/**
 * The FetchAccountResponseType interface represents the response data structure for fetching an account.
 */
export interface IFetchVirtualAccountResponseData {
  response_code: string;
  response_message: string;
  flw_ref: string;
  order_ref: string;
  account_number: string;
  frequency: string;
  bank_name: string;
  created_at: string;
  expiry_date: string;
  note: string;
  amount: number;
}
export interface IFetchBulkAccountResponse extends FLWResponse {
  data: IFetchBulkAccountResponseData;
}

export type IFetchBulkAccountResponseData = IFetchVirtualAccountResponseData[];

export interface IFetchVirtualAccountResponse extends FLWResponse {
  data: IFetchVirtualAccountResponseData;
}

/**
 * The below interface represents the payload for creating bulk accounts in TypeScript.
 */
export interface IBulkVirtualAccountPayload {
  email: string;
  bvn: string;
  accounts: number;
  frequency?: string;
  tx_ref: string;
  amount: number;
}

/**
 * The AccountPayload interface represents the data required for creating a new account.
 */
export interface IVirtualAccountPayload {
  email: string;
  bvn: string;
  narration: string;
  tx_ref: string;
  amount: number | null;
}

/**
 * The FetchBulkAccountPayload interface represents the payload for fetching bulk accounts, including the
 * batch ID and an optional HTTP method.
 */
export interface IFetchBulkVirtualAccountPayload {
  batch_id: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  excludeQuery?: boolean;
}

/**
 * The FetchAccountPayload interface represents the payload for fetching an account, including the order
 * reference, HTTP method, and an option to exclude the query.
 */
export interface IFetchVirtualAccountPayload {
  order_ref: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  excludeQuery?: boolean;
}

export interface IBvnUpdatePayload {
  bvn: string;
  order_ref: string;
}

export interface IBulkVirtualAccountResponse extends FLWResponse {
  data: ICreateVirtualBulkAccountResponseData;
}

// export interface CreateVirtualAccountPayload extends FLWResponse {
//   data: IVirtualAccountPayload;
// }

export interface IVirtualAccountResponse extends FLWResponse {
  data: ICreateVirtualAccountResponseData;
}

export interface IBatchVirtualAccountResponse extends FLWResponse {
  data: IFetchBulkAccountResponseData;
}

export type RequestMethod = 'GET' | 'POST' | 'OPTION' | 'PUT';
export type RequestHeader = {
  'Content-Type': string;
  Authorization: string;
};
export interface Payload {
  method: RequestMethod;
}

export interface RequestOptions {
  uri: string;
  baseUrl: string;
  method: 'body' | 'qs';
  datakey: boolean;
  json: object;
  headers: RequestHeader;
  body?: object;
  qs?: any;
}

export interface IBvnCheckResponse extends FLWResponse {
  data: BvnResponseDataType;
}

export interface FLWResponse {
  status: 'success' | 'error';
  message: string;
}

export type Currencies = 'NGN' | 'KES' | 'GHS' | 'USD' | 'ZAR' | 'UGX' | 'TZS' | 'RWF' | 'GBP' | 'XAF' | 'XOF';
export type PaymentTypes = 'card' | 'account' | 'account-ach-us';
export type CardProviders = 'MASTERCARD' | 'VISA' | 'VERVE';
export type Intervals = 'yearly' | 'quarterly' | 'monthly' | 'weekly' | 'daily';
