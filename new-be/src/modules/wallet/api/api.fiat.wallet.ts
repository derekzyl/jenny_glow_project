import Flutterwave from '@modules/flutterwave';
import logger from '@modules/logger/logger';
import { CreatePaymentPayload, CreatePaymentResponse } from '@modules/flutterwave/interfaces/interface.payments.flutterwave';
import config from '../../../config/config';

const flw = new Flutterwave(String(config.flutterwaveAPI.key), String(config.flutterwaveAPI.secret));

/**
 * Create Payment API
 * @param {CreatePaymentPayload} request
 * @returns {Promise<CreatePaymentResponse>}
 */
const createPaymentAPI = async (request: CreatePaymentPayload): Promise<CreatePaymentResponse> => {
  try {
    const data = await flw.Payments.createPayment(request);
    return data;
  } catch (error) {
    logger.error('Failed to create payment order: ', error);
    throw new Error('Failed to create payment order.');
  }
};

// const payload: IBillCategoryRequestFilters = {
//   airtime: 'NG',
//   data_bundle: customer, // '+23490803840303'
//   power: amount,
//   internet: 'ONCE',
//   toll: 'AIRTIME',
//   cable: reference, // '930rwrwr0049404444'
//   biller_code: request,
// };

// eslint-disable-next-line import/prefer-default-export
export { createPaymentAPI };
