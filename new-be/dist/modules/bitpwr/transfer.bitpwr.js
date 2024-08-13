/* eslint-disable import/prefer-default-export */
import { removeEmptyFields } from '../utils/remove';
/* The `TransferBitpwr` class provides methods for estimating transfer fees and making transfers using
the Bitpwr API. */
export class TransferBitpwr {
    /**
     * The constructor function takes a parameter of type Base and assigns it to the instance variable
     * base.
     *
     * @param base The "base" parameter is an instance of the "Base" class. It is being passed into the
     * constructor of the current class.
     */
    constructor(base) {
        this.base = base;
    }
    /**
     * The function `getTransferEstimate` sends a POST request to the `/transactions/estimate` endpoint
     * with the provided data and returns the response.
     *
     * @param data The `data` parameter is an object of type `TransferBitpwrFeeDataI`. It contains the
     * necessary information for estimating a transfer fee.
     *
     * @return a Promise that resolves to a TransferBitpwrFeeResponseDataI object.
     */
    async getTransferEstimate(data) {
        const newData = removeEmptyFields(data);
        const { data: response } = await this.base.request({
            path: `/transactions/estimate`,
            method: 'POST',
            data: newData,
        });
        return response;
    }
    /**
     * The function `makeTransferBitpwr` is an asynchronous function that makes a POST request to a
     * specified path with the provided data and returns the response.
     *
     * @param data The `data` parameter is an object of type `TransferCryptoBitpwrPayloadI`. It contains
     * the necessary information for making a transfer, such as the sender's address, recipient's
     * address, and the amount to be transferred.
     *
     * @return a Promise that resolves to a TransferCryptoBitpwrResponseI object.
     */
    async makeTransferBitpwr(data) {
        const { data: response } = await this.base.request({
            method: 'POST',
            data,
            path: '/transactions',
        });
        return response;
    }
}
//# sourceMappingURL=transfer.bitpwr.js.map