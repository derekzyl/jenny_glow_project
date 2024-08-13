import Flutterwave from '../../flutterwave';
import logger from '../../logger/logger';
import config from '../../../config/config';
const flw = new Flutterwave(String(config.flutterwaveAPI.key), String(config.flutterwaveAPI.secret));
/**
 * Get Bill Categories API
 * @param {GetBillingCategoriesPayload} request
 * @returns {Promise<BillingCategoryResponse>}
 */
export const getBillCategoriesAPI = async (request) => {
    try {
        const data = await flw.Bills.fetchBillsCat(request);
        // if !response {}
        return data;
    }
    catch (error) {
        logger.error('Failed to Fetch Bill categories: ', error);
        throw new Error('Failed to Fetch Bill categories.');
    }
};
/**
 * Validate a bill service API
 * @param {ValidateBillingPayload} request
 * @returns {Promise<ValidateBillResponse>}
 */
export const validateBillAPI = async (request) => {
    try {
        const data = await flw.Bills.validate(request);
        return data;
    }
    catch (error) {
        logger.error('Failed to validate bill: ', error);
        throw new Error('Failed to validate bill.');
    }
};
/**
 * Create Bill Payment API
 * @param {CreateBillPayload} request
 * @returns {Promise<CreateBillResponse>}
 */
export const createBillPaymentAPI = async (request) => {
    try {
        const data = await flw.Bills.createBill(request);
        return data;
    }
    catch (error) {
        logger.error('Failed to create bill payment: ', error);
        throw new Error('Failed to create bill payment.');
    }
};
export const verifyBillPaymentStatusAPI = async (transRef) => {
    try {
        const data = await flw.Bills.fetchStatus({ reference: transRef });
        return data;
    }
    catch (error) {
        logger.error('Failed to verify bill payment: ', error);
        throw new Error('Failed to verify bill payment.');
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
//# sourceMappingURL=api.bill.js.map