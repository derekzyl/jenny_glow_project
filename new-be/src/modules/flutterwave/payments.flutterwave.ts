import { AxiosResponse, Method } from 'axios';
import Base from './base.flutterwave';
import { CreatePaymentPayload, CreatePaymentResponse } from './interfaces/interface.payments.flutterwave';

class Payments {
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
   * Initiates a create payment.
   *
   * @param data - The payload for creating a payment.
   * @returns A promise that resolves with the payment response.
   */
  public async createPayment(data: CreatePaymentPayload): Promise<CreatePaymentResponse> {
    return this.processResponse<CreatePaymentResponse>('payments', data, 'POST');
  }
}

export default Payments;
