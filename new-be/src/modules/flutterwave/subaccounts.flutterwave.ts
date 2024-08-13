import { AxiosResponse } from 'axios';
import Base from './base.flutterwave';

import {
  BVNResponsePayloadType,
  CreateSubAccountPayload,
  CreateSubAccountResponseType,
  FetchBulkSubAccountResponseType,
  FetchStaticSubAccountResponseType,
  FetchSubAccountBalanceResponseType,
  FetchSubAccountPayload,
  FetchSubAccountResponseType,
  FetchTransactionsSubAccountResponseType,
  InitCreateAccountResponseType,
  InitCreateSubAccountPayloadType,
  TransactionQueryParams,
} from './interfaces/interface.payoutsubaccount';

/* The VirtualAccount class is responsible for creating, fetching, updating, and deleting virtual
account numbers. */
class SubVirtualAccount {
  private base: Base;

  /**
   * The constructor function takes a parameter of type Base and assigns it to the instance variable
   * base.
   * @param {Base} base - The "base" parameter is an instance of the "Base" class. It is being passed
   * into the constructor of the current class.
   */
  constructor(base: Base) {
    this.base = base;
  }

  /**
   * Sends a request to create a virtual account number and returns the response.
   * @param {AccountPayload} data - Object containing necessary info to create a virtual account number.
   * @returns The response from the API call to create a virtual account number.
   */
  async initCreateGetBvn(payload: InitCreateSubAccountPayloadType) {
    const { data: response }: AxiosResponse<InitCreateAccountResponseType> = await this.base.request(
      `/v3/bvn/verifications`,
      { ...payload, method: 'POST', excludeQuery: true },
      'POST'
    );
    return response;
  }

  async verifyBvnData(bvnRef: string) {
    const { data: response }: AxiosResponse<BVNResponsePayloadType> = await this.base.request(
      `/v3/bvn/verifications/${bvnRef}`,
      { excludeQuery: true, method: 'GET' },
      'GET'
    );

    return response;
  }

  async create(data: CreateSubAccountPayload) {
    const { data: response }: AxiosResponse<CreateSubAccountResponseType> = await this.base.request(
      `/v3/payout-subaccounts`,
      {
        ...data,
      },
      'POST'
    );

    return response;
  }

  /**
   * The function fetches data for a specific subaccount using its account reference.
   * @param data - The `data` parameter is an object that contains the `account_reference` property.
   * This property is of type `FetchSubAccountPayload` and is used to specify the account reference for
   * fetching a sub account.
   * @returns The response data from the API call is being returned.
   */
  async fetch(data: Pick<FetchSubAccountPayload, 'account_reference'>) {
    const { data: response }: AxiosResponse<FetchSubAccountResponseType> = await this.base.request(
      `v3/payout-subaccounts/${data.account_reference}`,
      {},
      'GET'
    );

    return response;
  }

  /**
   * The function fetchBulk() is an asynchronous function that makes a GET request to retrieve a list
   * of payout subaccounts.
   * @returns The response data from the API call to `v3/payout-subaccounts`.
   */
  async fetchBulk() {
    const modData = {
      excludeQuery: false,
    };
    const { data: response }: AxiosResponse<FetchBulkSubAccountResponseType> = await this.base.request(
      `v3/payout-subaccounts`,
      modData,
      'GET'
    );

    return response;
  }

  /**
   * The function updates a subaccount with the provided data.
   * @param data - The `data` parameter is an object that contains the following properties:
   * @returns the response data from the API call.
   */
  async update(
    data: Partial<Pick<CreateSubAccountPayload, 'account_name' | 'email' | 'mobilenumber'>> &
      Pick<CreateSubAccountResponseType['data'], 'account_reference'>
  ) {
    const body: Omit<typeof data, 'account_reference'> = data;
    const { data: response }: AxiosResponse<FetchSubAccountResponseType> = await this.base.request(
      `v3/payout-subaccounts/${data.account_reference}`,
      body,
      'PUT'
    );

    return response;
  }

  /**
   * The function `transactions` retrieves transactions for a specific subaccount using the provided
   * account reference and query parameters.
   * @param data - The `data` parameter is an object that contains the `account_reference` property.
   * This property is of type `CreateSubAccountResponseType['data']`, which means it should have the
   * same structure as the `data` property in the `CreateSubAccountResponseType` type.
   * @param {TransactionQueryParams} queryParams - The `queryParams` parameter is an object that
   * contains optional query parameters for the transaction request. These parameters can be used to
   * filter and sort the transactions returned by the API.
   * @returns The response from the API call is being returned.
   */
  async transactions(
    data: Pick<CreateSubAccountResponseType['data'], 'account_reference'>,
    queryParams: TransactionQueryParams
  ) {
    const { data: response }: AxiosResponse<FetchTransactionsSubAccountResponseType> = await this.base.request(
      `v3/payout-subaccounts/${data.account_reference}/transactions`,
      queryParams,
      'GET'
    );
    return response;
  }

  /**
   * The `balance` function retrieves the balance of a subaccount based on the specified currency and
   * account reference.
   * @param queryParams - An object that contains the query parameters for the balance request. It
   * includes the 'currency' property, which specifies the currency for which the balance is requested.
   * @param data - The `data` parameter is an object that contains the `account_reference` property.
   * This property is of type `string` and represents the account reference of a subaccount.
   * @returns The response from the API call is being returned.
   */
  async balance(
    queryParams: Pick<TransactionQueryParams, 'currency'>,
    data: Pick<CreateSubAccountResponseType['data'], 'account_reference'>
  ) {
    const { data: response }: AxiosResponse<FetchSubAccountBalanceResponseType> = await this.base.request(
      `v3/payout-subaccounts/${data.account_reference}/balances`,
      queryParams,
      'GET'
    );
    return response;
  }

  /**
   * The function `getOtherCurrencyBank` retrieves the balance of a subaccount in a specific currency.
   * @param queryParams - An object that contains the query parameters for the API request. It includes
   * the 'currency' property, which specifies the currency for which the bank details are being
   * fetched.
   * @param data - The `data` parameter is an object that contains the `account_reference` property.
   * This property is of type `string` and represents the reference or identifier of a sub-account in a
   * bank.
   * @returns the response data from the API call to fetch the balance of a subaccount in a specific
   * currency.
   */
  async getOtherCurrencyBank(
    queryParams: Pick<TransactionQueryParams, 'currency'>,
    data: Pick<CreateSubAccountResponseType['data'], 'account_reference'>
  ) {
    const { data: response }: AxiosResponse<FetchStaticSubAccountResponseType> = await this.base.request(
      `v3/payout-subaccounts/${data.account_reference}/static-account`,
      queryParams,
      'GET'
    );
    return response;
  }
}

/* The line `export default VirtualAccount;` is exporting the `VirtualAccount` class as the default
export of the module. This means that when another module imports this module, they can import the
`VirtualAccount` class directly without having to specify the name of the class in curly braces. For
example, in another module, you can import the `VirtualAccount` class like this: `import
VirtualAccount from './virtualAccount';`. */
export default SubVirtualAccount;
