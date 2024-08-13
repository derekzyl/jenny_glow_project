import { removeProp } from '../utils/remove';
// import amount_to_be_paid from '../services/bills/base.amount.to-be-paid';
// import createbill from '../services/bills/base.create-bill.payment';
// import create_bulk from '../services/bills/base.create-bulk.bills';
// import create_order_billing from '../services/bills/base.create-order-billing-code';
// import bills from '../services/bills/base.get-bill-payments';
// import bill_cat from '../services/bills/base.get.bill-categories';
// import bill_agencies from '../services/bills/base.get.bill-payment-agencies';
// import status from '../services/bills/base.get.status';
// import update_bills_order from '../services/bills/base.update-bills.order';
// import prdts_under_agency from '../services/bills/base.update-bills.order';
// import validate_bill from '../services/bills/base.validate-bill';
// import {
//   AmountToBePaidPayload,
//   CreateBillPayload,
//   CreateBulkBillPayload,
//   CreateOrdBillingPayload,
//   FetchBillsPayload,
//   GetBillingCategoriesPayload,
//   ValidateBillingPayload,
// } from '../services/bills/types';
// const get_a_recurring = require('../services/bills/base.get-a-recurring-bill')
// const get_recurring_bills = require ('../services/bills/base.get.recurrings-bills')
class Bills {
    /**
     * Initializes a new instance of the Bills class.
     *
     * @param arg - An instance of Base.
     */
    constructor(arg) {
        this.base = arg;
    }
    /**
     * Handles the response from the API request.
     *
     * @param data - The payload for the request.
     * @returns A promise that resolves with the response data.
     */
    async processResponse(path, data, method) {
        try {
            const resp = await this.base.request(`v3/${path}`, data, method);
            return resp.data;
        }
        catch (error) {
            // Handle error here if needed
            throw new Error(`${error}`);
        }
    }
    /**
     * Initiates a bill payment.
     *
     * @param data - The payload for creating a bill payment.
     * @returns A promise that resolves with the bill payment response.
     */
    async createBill(data) {
        const res = await this.processResponse('bills', data, 'POST');
        return res;
    }
    /**
     * Gets the amount to be paid for a product.
     *
     * @param data - The payload for getting the amount to be paid.
     * @returns A promise that resolves with the amount to be paid response.
     */
    amtToBePaid(data) {
        return this.processResponse(`billers/${data.id}/products/${data.product_id}`, data, 'GET');
    }
    /**
     * Creates bulk bills payment.
     *
     * @param data - The payload for creating bulk bills payment.
     * @returns A promise that resolves with the bulk bills payment response.
     */
    createBulk(data) {
        return this.processResponse('bulk-bills', data, 'POST');
    }
    /**
     * Creates an order using the biller code and the product code.
     *
     * @param data - The payload for creating an order.
     * @returns A promise that resolves with the order creation response.
     */
    createOrdBilling(data) {
        return this.processResponse(`billers/${data.id}/products/${data.product_id}/orders`, data, 'POST');
    }
    /**
     * Retrieves a history of all purchased bill services including commission earned.
     *
     * @param data - Optional payload for fetching bill payments.
     * @returns A promise that resolves with the bill payments history response.
     */
    fetchBills(data) {
        return this.processResponse(`v3/bills?from=${data === null || data === void 0 ? void 0 : data.from}&to=${data === null || data === void 0 ? void 0 : data.to}`, data || {}, 'GET');
    }
    /**
     * Retrieves information for each Biller.
     *
     * @param data - Optional payload for fetching bill categories.
     * @returns A promise that resolves with the bill categories information response.
     */
    fetchBillsCat(data) {
        return this.processResponse('bill-categories', Object.assign(Object.assign({}, data), { country: 'NG' }) || {}, 'GET');
    }
    /**
     * Retrieves a list of government agencies you can pay into.
     *
     * @param data - Optional payload for fetching bill agencies.
     * @returns A promise that resolves with the bill agencies list response.
     */
    fetchBillsAgencies(data) {
        return this.processResponse('billers', data || {}, 'GET');
    }
    /**
     * Retrieves the status of a bill purchase.
     *
     * @param data - The transaction reference for the bill payment.
     * @returns A promise that resolves with the bill payment status response.
     */
    fetchStatus(data) {
        return this.processResponse(`bills/${data.reference}`, data, 'GET');
    }
    /**
     * Retrieves all products under a government agency.
     *
     * @param data - The reference for the government agency.
     * @returns A promise that resolves with the products under agency response.
     */
    productsUnderAgency(data) {
        return this.processResponse(`product-orders/${data.reference}`, data, 'PUT');
    }
    /**
     * Updates bills order using the biller code and the product Id.
     *
     * @param data - The reference for updating bills order.
     * @returns A promise that resolves with the updated bills order response.
     */
    updateBills(data) {
        return this.processResponse(`product-orders/${data.reference}`, data, 'PUT');
    }
    /**
     * Validates services like DSTV smartcard number, Meter number, etc.
     *
     * @param data - The payload for validating a bill service.
     * @returns A promise that resolves with the validation response.
     */
    async validate(data) {
        const dat = removeProp(data, ['item_code']);
        const { data: response } = await this.base.request(`v3/bill-items/${data.item_code}/validate`, Object.assign(Object.assign({}, dat), { excludeQuery: false, method: 'GET' }), 'GET');
        return response;
    }
}
export default Bills;
//# sourceMappingURL=bills.flutterwave.js.map