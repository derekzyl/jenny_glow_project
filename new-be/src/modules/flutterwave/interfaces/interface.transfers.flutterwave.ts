// --------------------------------
// bulk tranfer payload starts here
// --------------------------------


import { CurrencyCodesEnum, FLWResponse } from './interface.flutterwave';

/**
 * The above type represents a payload containing metadata information such as first name, last name,
 * email, mobile number, recipient address, sender, and sender country.
 * @property {string} first_name - The first name of the recipient or sender.
 * @property {string} last_name - The last name of the recipient or sender.
 * @property {string} email - The email property is used to store the email address of a person.
 * @property {string} mobile_number - The mobile_number property is used to store the phone number of
 * the recipient.
 * @property {string} recipient_address - The address of the recipient.
 * @property {string} sender - The name of the sender.
 * @property {string} sender_country - The country of the sender.
 */
export type MetaDataPayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_number?: string;
  recipient_address?: string;
  sender?: string;
  sender_country?: string;
};

/**
 * The above type represents the payload data for a bulk transfer operation, including bank code,
 * account number, amount, currency, and optional narration, reference, and metadata.
 * @property {string} bank_code - The bank code is a string that represents the code of the bank where
 * the transfer will be made to.
 * @property {string} account_number - A string representing the account number of the recipient.
 * @property {number} amount - The amount property is of type number and represents the amount of money
 * to be transferred.
 * @property {string} currency - The currency property is a string that represents the currency in
 * which the transfer amount is specified.
 * @property {string} narration - The "narration" property is an optional string that can be used to
 * provide additional information or description about the transfer. It can be used to provide context
 * or details about the purpose of the transfer.
 * @property {string} reference - The reference property is an optional string that can be used to
 * provide a unique identifier for the bulk transfer data payload. It can be used to track or reference
 * the transfer in the future.
 * @property {MetaDataPayload[]} meta - The `meta` property is an optional field that can be used to
 * include additional metadata information related to the bulk transfer data payload. It is an array of
 * `MetaDataPayload` objects.
 */
export type BulkTransferDataPayload = {
  bank_code: string;
  account_number: string;
  amount: number;
  currency: string;
  narration?: string;
  reference?: string;
  meta?:
    | MetaDataPayload[]
 
};

/**
 * The `BulkTransferSchemaPayload` type represents a payload for bulk transfer data, which includes a
 * title and an array of `BulkTransferDataPayload` objects.
 * @property {string} title - An optional string property that represents the title of the bulk
 * transfer schema payload.
 * @property {BulkTransferDataPayload[]} bulk_data - The `bulk_data` property is an array of
 * `BulkTransferDataPayload` objects.
 */
export type BulkTransferSchemaPayload = {
  title?: string;
  bulk_data: BulkTransferDataPayload[];
};

// -----------------------------
// bulk tranfer payload ends here
// _______________________________

export type BulkTransferResponseType = FLWResponse & {
  data: { id: number; created_at: string; approver: string };
};

export type GetTransferFee = {
  currency: CurrencyCodesEnum;
  method: 'GET';
  amount: number;
  excludeQuery: boolean;
};

export type FeeResponseType = FLWResponse & {
  data: { fee_type: string; currency: string; fee: number }[];
};

// -----------------------------
//  tranfer payload starts here
// _______________________________

export type TransferSchemaPayload = {
  amount: number;
  currency: string;
  account_bank: string;
  account_number: string;
  narration?: string | undefined;
  debit_subaccount?: string | undefined;
  debit_currency?: string | undefined;
  reference?: string | undefined;
  beneficiary?: number | undefined;
  beneficiary_name?: string | undefined;
  destination_branch_code?: string | undefined;
  callback_url?: string | undefined;
  meta?:[]

};

// -----------------------------
// bulk transfer payload ends here
// _______________________________

export type TransferResponseType = FLWResponse & {
  data: {
    id: number;
    account_number: string;
    bank_code: string;
    full_name: string;
    created_at: string; // Assuming this is a date string, you may want to use a Date type
    currency: string;
    debit_currency: string;
    amount: number;
    fee: number;
    status: string;
    reference: string;
    meta: {
      sender: string;
      FirstName: string;
      LastName: string;
      BeneficiaryCountry: string;
      MobileNumber: string;
      MerchantName: string;
    }[]; // Adjust the type based on the actual structure of the "meta" property
    narration: string;
    complete_message: string;
    requires_approval: number;
    is_approved: number;
    bank_name: string;
    MerchantName: string;
  };
};
export type ManyTransfersResponseType = FLWResponse & {
  meta: {
    page_info: {
      total: number;
      current_page: number;
      total_pages: number;
    };
  };
  data: TransferResponseType['data'][];
};

export type FetchTransferByIdPayload = {
  id: number;

  method: 'GET';
  excludeQuery: boolean;
};

export type WalletTransferPayload = {
  amount: number;
  currency: string;
  account_bank: string;
  account_number: string;
  narration: string;
  debit_subaccount: string;
  debit_currency?: string;
  reference?: string;
};
export type resolveBankAccountSchema = {
  account_bank: string;
  account_number: string;
  country: string;
  type?: string;
  method?: 'POST';
};

export type resolveBankAccountResponseType = FLWResponse & {
  data: { account_name: string; account_number: string };
};

export type getBanksResponseType = FLWResponse & {
  data: { id: number; name: string; code: string }[];
};
export type getBankBranchesResponseType = FLWResponse & {
  data: { id: number; branch_name: string; branch_code: string; swift_code: string; bic: string; bank_id: string }[];
};
