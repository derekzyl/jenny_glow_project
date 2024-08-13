import { AxiosResponse } from 'axios';
import Base from './base.flutterwave';
import { CountryCodesEnum } from './interfaces/interface.flutterwave';
import {
  BulkTransferResponseType,
  BulkTransferSchemaPayload,
  FeeResponseType,
  FetchTransferByIdPayload,
  GetTransferFee,
  ManyTransfersResponseType,
  TransferResponseType,
  TransferSchemaPayload,
  WalletTransferPayload,
  getBankBranchesResponseType,
  getBanksResponseType,
  resolveBankAccountResponseType,
  resolveBankAccountSchema,
} from './interfaces/interface.transfers.flutterwave';

class Transfers {
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
   * The function `bulk` sends a bulk transfer request using the provided data and returns the
   * response.
   * @param {BulkTransferSchemaPayload} data - The `data` parameter is of type
   * `BulkTransferSchemaPayload`. It is an object that contains the payload for the bulk transfer
   * request.
   * @returns The response from the API call to `v3/bulk-transfers`.
   */
  async bulk(data: BulkTransferSchemaPayload) {
    const { data: response }: AxiosResponse<BulkTransferResponseType> = await this.base.request(
      `v3/bulk-transfers`,
      data,
      'GET'
    );

    return response;
  }

  /**
   * The `fee` function is an asynchronous function that calculates the transfer fee based on the
   * provided amount and currency.
   * @param data - The `data` parameter is an object that contains the following properties:
   * @returns the response data from the API call.
   */
  async fee(data: Pick<GetTransferFee, 'amount' | 'currency'>) {
    const modData: GetTransferFee = {
      ...data,
      excludeQuery: true,
      method: 'GET',
    };

    const { data: response }: AxiosResponse<FeeResponseType> = await this.base.request(
      `v3/transfers/fee?currency=${data.currency}&amount=${data.amount}`,
      modData,
      'GET'
    );

    return response;
  }

  /**
   * The function `initiateTransfer` is an asynchronous function that initiates a transfer using the
   * provided data and returns a promise that resolves to the response of the transfer.
   * @param {TransferSchemaPayload} data - The `data` parameter is an object that contains the
   * necessary information for initiating a transfer. It should have the following properties:
   * @returns a Promise that resolves to a TransferResponseType.
   */
  async initiateTransfer(data: TransferSchemaPayload): Promise<TransferResponseType> {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Invalid data parameter');
    }

    const requiredProperties = ['amount', 'currency', 'account_bank', 'account_number'];
    const missingProperties = requiredProperties.filter((prop) => !(prop in data));
    if (missingProperties.length > 0) {
      throw new Error(`Missing required properties: ${missingProperties.join(', ')}`);
    }

    const { data: response }: AxiosResponse<TransferResponseType> = await this.base.request(`v3/transfers`, data, 'POST');

    return response;
  }

  /**
   * The function fetches transfer data by its ID using a GET request.
   * @param data - The `data` parameter is an object that contains the `id` property. The `id` property
   * is used to specify the ID of the transfer that you want to fetch.
   * @returns The response data from the API call is being returned.
   */
  async fetchTransferById(data: Pick<FetchTransferByIdPayload, 'id'>) {
    const modData: FetchTransferByIdPayload = { ...data, method: 'GET', excludeQuery: true };
    const { data: response }: AxiosResponse<TransferResponseType> = await this.base.request(
      `/v3/transfers/${modData.id}`,
      modData,
      'GET'
    );

    return response;
  }

  /**
   * The function `getATransfer` retrieves transfer data based on the provided parameter.
   * @param param - The parameter `param` is of type `Record<string, any>`, which means it can be any
   * object with string keys and any values.
   * @returns The response from the API call is being returned.
   */
  async getAllTransfers(param: Record<string, any>) {
    if (param === undefined || param === null) {
      const modParam = { method: 'GET' };

      const { data: response }: AxiosResponse<ManyTransfersResponseType> = await this.base.request(
        `/v3/transfers?`,
        modParam,
        'GET'
      );

      return response;
    }
    const { data: response }: AxiosResponse<ManyTransfersResponseType> = await this.base.request(
      `/v3/transfers`,
      { method: 'GET', ...param },
      'GET'
    );

    return response;
  }

  /**
   * The `getBanks` function retrieves a list of banks based on the specified country code, with a
   * default value of Nigeria.
   * @param {CountryCodesEnum} payload - The `payload` parameter is of type `CountryCodesEnum`, which
   * is an enumeration representing different country codes. In this case, the default value for
   * `payload` is `CountryCodesEnum.Nigeria`.
   * @returns The response from the API call is being returned.
   */
  async getBanks(payload: CountryCodesEnum = CountryCodesEnum.Nigeria) {
    const { data: response }: AxiosResponse<getBanksResponseType> = await this.base.request(
      `/v3/banks/${payload}`,
      { method: 'GET', excludeQuery: true },
      'GET'
    );

    return response;
  }

  async getBankBranches(bankId: string) {
    const { data: response }: AxiosResponse<getBankBranchesResponseType> = await this.base.request(
      `/v3/banks/${bankId}/branches`,
      { method: 'GET', excludeQuery: true },
      'GET'
    );

    return response;
  }

  async verifyBankAccount(bankDetails: resolveBankAccountSchema) {
    // eslint-disable-next-line no-param-reassign
    bankDetails.method = 'POST';
    const { data: response }: AxiosResponse<resolveBankAccountResponseType> = await this.base.request(
      `/v3/accounts/resolve`,
      bankDetails,
      'POST'
    );

    return response;
  }

  /**
   * The function `walletToWallet` transfers funds from one wallet to another, validating the transfer
   * payload and returning the response.
   * @param {WalletTransferPayload} transferPayload - The `transferPayload` parameter is an object that
   * contains the necessary information for transferring funds from one wallet to another. It should
   * have the following properties:
   * @returns a Promise that resolves to a TransferResponseType.
   */
  async walletToWallet(transferPayload: WalletTransferPayload) {
    if (!transferPayload || typeof transferPayload !== 'object' || Array.isArray(transferPayload)) {
      throw new Error('Invalid transferPayload parameter');
    }

    const requiredProperties = ['amount', 'currency', 'account_bank', 'account_number'];
    const missingProperties = requiredProperties.filter((prop) => !(prop in transferPayload));
    if (missingProperties.length > 0) {
      throw new Error(`Missing required properties: ${missingProperties.join(', ')}`);
    }

    const { data: response }: AxiosResponse<TransferResponseType> = await this.base.request(`v3/transfers`, transferPayload);

    return response;
  }

  /**
   * The function `retryTransfer` sends a POST request to retry a transfer with the specified ID and
   * returns the response.
   * @param data - The `data` parameter is an object that contains the `id` property.
   * @returns The response from the API call is being returned.
   */
  async retryTransfer(data: { id: string }) {
    const modData = { ...data, method: 'POST' };
    const { data: response }: AxiosResponse<TransferResponseType> = await this.base.request(
      `v3/transfers/${modData.id}/retries`,
      modData,
      'POST'
    );
    return response;
  }
}

/* The line `export default Transfers;` is exporting the `Transfers` class as the default export of the
module. This means that when another module imports this module, they can import the `Transfers`
class directly without having to specify the name of the class in curly braces. For example, in
another module, you can import the `Transfers` class like this: `import Transfers from
'./transfers';`. */
export default Transfers;
