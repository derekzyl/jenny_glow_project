import { FLWResponse } from './interface.flutterwave';

export type CreateSubAccountPayload = {
  account_name: string;
  email: string;
  mobilenumber: string;
  country: string;
};

export type CreateSubAccountResponseType = FLWResponse & {
  data: {
    id: number;
    account_reference: string;
    account_name: string;
    barter_id: string;
    email: string;
    mobilenumber: string;
    country: string;
    nuban: string;
    bank_name: string;
    bank_code: string;
    status: string;
    created_at: string;
    transfer_limits?: string;
  };
};

export type FetchSubAccountResponseType = FLWResponse & {
  data: CreateSubAccountResponseType['data'];
};

export type FetchBulkSubAccountResponseType = FLWResponse & {
  data: CreateSubAccountResponseType['data'][];
};

export type FetchSubAccountPayload = {
  account_reference: string;
};

type PageInfo = {
  total: number;
  current_page: number;
  total_pages: number;
};

type Transaction = {
  type: string;
  amount: number;
  currency: string;
  balance_before: number;
  balance_after: number;
  reference: string;
  date: string;
  remarks: string;
  sent_currency: string;
  rate_used: number;
  sent_amount: number;
  statement_type: string;
};

type Data = {
  page_info: PageInfo;
  transactions: Transaction[];
};

export type FetchTransactionsSubAccountResponseType = FLWResponse & {
  data: Data;
};

export type TransactionQueryParams = {
  from: string;
  to: string;
  currency: 'USD' | 'NGN' | 'EUR' | 'GBP';
};

type DataAcc = {
  currency: string;
  available_balance: number;
  ledger_balance: number;
};

export type FetchSubAccountBalanceResponseType = FLWResponse & {
  data: DataAcc;
};

export type FetchStaticSubAccountResponseType = FLWResponse & {
  data: { static_account: string; bank_name: string; bank_code: string; currency: string; type: string };
};

export type InitCreateSubAccountPayloadType = {
  bvn: string;
  firstname: string;
  lastname: string;
  redirect_url?: string;
  method?: string;
  excludeQuery?: boolean;
};

export type InitCreateAccountResponseType = FLWResponse & {
  data: {
    url: string;
    reference: string;
  };
};

export type BVNResponsePayloadType = FLWResponse & {
  data: BVNDetails;
};

export type BVNDetails = {
  first_name: string;
  last_name: string;
  status: string;
  reference: string;
  callback_url: string | null;
  bvn_data: BVNData;
  created_at: string;
  id: number;
  AccountId: number;
};

type BVNData = {
  nin: string;
  email: string;
  gender: string;
  surname: string;
  serialNo: string | null;
  faceImage: string;
  firstName: string;
  landmarks: string | null;
  branchName: string | null;
  middleName: string;
  nameOnCard: string | null;
  dateOfBirth: string;
  lgaOfOrigin: string;
  watchlisted: string;
  lgaOfCapture: string | null;
  phoneNumber1: string;
  phoneNumber2: string | null;
  maritalStatus: string;
  stateOfOrigin: string;
  enrollBankCode: string | null;
  enrollUserName: string;
  enrollmentDate: string | null;
  lgaOfResidence: string;
  stateOfCapture: string;
  additionalInfo1: string | null;
  productReference: string;
  stateOfResidence: string;
};
