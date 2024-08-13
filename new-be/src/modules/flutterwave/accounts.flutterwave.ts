import { AxiosResponse } from 'axios';
import Base from './base.flutterwave';
import {
  AccountPayload,
  BulkAccountPayload,
  BvnCheckResponseType,
  CreateAccountResponseType,
  CreateBulkAccountResponseType,
  FetchAccountPayload,
  FetchAccountResponseType,
  FetchBulkAccountPayload,
  FetchBulkAccountResponseType,
} from './interfaces/interface.accounts.flutterwave';

/* The VirtualAccount class is responsible for creating, fetching, updating, and deleting virtual
account numbers. */
class VirtualAccount {
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

  async checkBvn(data: { bvn: string }) {
    const { data: response }: AxiosResponse<BvnCheckResponseType> = await this.base.request(`v3/kyc/bvns${data.bvn}`, {
      method: 'GET',
    });
    return response;
  }

  /**
   * The function creates multiple virtual account numbers in bulk.
   * @param {BulkAccountPayload} data - The `data` parameter is of type `BulkAccountPayload`. It
   * represents the payload containing the data for creating bulk virtual account numbers.
   * @returns The response from the API call is being returned.
   */
  async createBulk(data: BulkAccountPayload) {
    const { data: response }: AxiosResponse<CreateBulkAccountResponseType> = await this.base.request(
      `v3/bulk-virtual-account-numbers`,
      { ...data, method: 'POST' }
    );
    return response;
  }

  /**
   * Sends a request to create a virtual account number and returns the response.
   * @param {AccountPayload} data - Object containing necessary info to create a virtual account number.
   * @returns The response from the API call to create a virtual account number.
   */
  async create(data: AccountPayload) {
    const { data: response }: AxiosResponse<CreateAccountResponseType> = await this.base.request(
      `v3/virtual-account-numbers`,
      { ...data, is_permanent: true, method: 'POST' }
    );

    return response;
  }

  /**
   * The function fetches account data using a GET request with a specified order reference.
   * @param data - The `data` parameter is an object that contains the `order_ref` property.
   * @returns an AxiosResponse object.
   */
  async fetch(data: Pick<FetchAccountPayload, 'order_ref'>) {
    const modData: FetchAccountPayload = { ...data };

    const { data: response }: AxiosResponse<FetchAccountResponseType> = await this.base.request(
      `v3/bulk-virtual-account-numbers/${data.order_ref}`,
      modData,
      'GET'
    );

    return response;
  }

  /**
   * The function fetches bulk virtual account numbers based on a batch ID.
   * @param data - The `data` parameter is an object that contains the `batch_id` property. The
   * `batch_id` is used to identify a specific batch of virtual account numbers.
   * @returns The response data from the API call is being returned.
   */
  async fetchBulk(data: Pick<FetchBulkAccountPayload, 'batch_id'>) {
    const modData = {
      method: 'GET',
      excludeQuery: true,
    };
    const { data: response }: AxiosResponse<FetchBulkAccountResponseType> = await this.base.request(
      `v3/bulk-virtual-account-numbers/${data.batch_id}`,
      modData
    );

    return response;
  }

  /**
   * The function `updateBvn` updates the BVN (Bank Verification Number) of an account using the
   * Flutterwave API.
   * @param data - The `data` parameter is an object that contains two properties:
   * @returns The response from the API call is being returned.
   */
  async updateBvn(data: Pick<AccountPayload, 'bvn'> & Pick<FetchAccountPayload, 'order_ref'>) {
    // api.flutterwave.com/v3/virtual-account-numbers/:order_ref
    // api.flutterwave.com/v3/virtual-account-numbers/:order_ref
    const modData: Partial<AccountPayload> & Partial<FetchAccountPayload> = { ...data };
    const { data: response }: AxiosResponse<FetchAccountResponseType> = await this.base.request(
      `v3/virtual-account-numbers/${modData.order_ref}`,
      modData,
      'PUT'
    );
    return response;
  }

  /**
   * The `deleteAccount` function is an asynchronous function that deletes an account using the
   * provided order reference.
   * @param data - The `data` parameter is an object that contains the `order_ref` property. The
   * `order_ref` is a unique identifier for the account that needs to be deleted.
   * @returns The response from the API call is being returned.
   */
  async deleteAccount(data: Pick<FetchAccountPayload, 'order_ref'>) {
    const modData: Partial<FetchAccountPayload> = { ...data };
    const { data: response }: AxiosResponse = await this.base.request(
      `v3/virtual-account-numbers/${modData.order_ref}`,
      modData,
      'DELETE'
    );
    return response;
  }
}

/* The line `export default VirtualAccount;` is exporting the `VirtualAccount` class as the default
export of the module. This means that when another module imports this module, they can import the
`VirtualAccount` class directly without having to specify the name of the class in curly braces. For
example, in another module, you can import the `VirtualAccount` class like this: `import
VirtualAccount from './virtualAccount';`. */
export default VirtualAccount;
