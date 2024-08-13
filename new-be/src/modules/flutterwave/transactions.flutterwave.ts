import { AxiosResponse, Method } from 'axios';
import Base from './base.flutterwave';
import { VerifyTransactionResponse } from './interfaces/interface.transacions.flutterwave';
import { IDPayload } from './interfaces/interface.flutterwave';

class Transactions {
  private rave: Base;

  /**
   * Initializes a new instance of the Payments class.
   *
   * @param arg - An instance of Base.
   */
  constructor(arg: Base) {
    this.rave = arg;
  }

  /**
   * Handles the response from the API request.
   *
   * @param data - The payload for the request.
   * @returns A promise that resolves with the response data.
   */
  private async processResponse<T>(path: string, data: any, method?: Method): Promise<T> {
    try {
      const resp: AxiosResponse<T> = await this.rave.request(`v3/${path}`, data, method);
      return resp.data;
    } catch (error) {
      // Handle error here if needed
      throw new Error(`${error}`);
    }
  }

  /**
   * This method helps query the final status of a transaction.
   * It can be used to check transactions of all payment types after they have been attempted.
   *
   * @param data - The payload for creating a payment.
   * @returns A promise that resolves with the payment response.
   */
  public async verify(data: IDPayload): Promise<VerifyTransactionResponse> {
    return this.processResponse<VerifyTransactionResponse>(`transactions/${data.id}/verify`, data, 'GET');
  }
}

export default Transactions;
