/* The `AddressBitpwr` class is a TypeScript class that provides methods for retrieving transaction
data, address balance, and addresses from a Bitpwr API. */
export class AddressBitpwr {
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
     * The function `getAddressTransaction` is an asynchronous function that retrieves transaction data
     * for a given address ID and page number.
     *
     * @param addressId The `addressId` parameter is a string that represents the unique identifier of an
     * address. It is used to specify which address's transactions should be retrieved.
     * @param page The "page" parameter is used to specify the page number of the transactions to
     * retrieve. It is typically used for pagination purposes, allowing you to retrieve transactions in
     * batches or chunks.
     *
     * @return a Promise that resolves to an object of type ManyTransactionBitpwrResponseI.
     */
    async getAddressTransaction(addressId, page) {
        const { data: response } = await this.base.request({
            data: { includeQueryParams: true, page },
            method: 'GET',
            path: `/addresses/${addressId}/transactions`,
        });
        return response;
    }
    /**
     * The function `getAddressBalance` is an asynchronous function that takes an `addressId` as a
     * parameter and returns a promise that resolves to a `GetWalletAddressBalanceResponse` object.
     *
     * @param addressId The `addressId` parameter is a string that represents the unique identifier of a
     * wallet address.
     *
     * @return a Promise that resolves to a GetWalletAddressBalanceResponse object.
     */
    async getAddressBalance(addressId) {
        const { data: response } = await this.base.request({
            data: {},
            method: 'GET',
            path: `/addresses/${addressId}/balance`,
        });
        return response;
    }
    /**
     * The function `getAddresses` is an asynchronous function that takes a payload as input and returns
     * a promise that resolves to a response object.
     *
     * @param data The `data` parameter is an object of type `GetWalletAddressPayload`. It contains the
     * necessary data for the API request to retrieve wallet addresses.
     *
     * @return a Promise that resolves to an object of type GetSubAccountBitpwrAddressesResponseI.
     */
    async getAddresses(data) {
        const { data: response } = await this.base.request({
            data: Object.assign({ includeQueryParams: true }, data),
            method: 'GET',
            path: `/addresses`,
        });
        return response;
    }
    /**
     * The function `getOneAddress` is an asynchronous function that retrieves a specific address using
     * its ID.
     *
     * @param addressId The `addressId` parameter is a string that represents the unique identifier of an
     * address.
     *
     * @return a Promise that resolves to an object of type CreateSubAccountBitpwrAddressDataResponseI.
     */
    async getOneAddress(addressId) {
        const { data: response } = await this.base.request({
            data: {},
            method: 'GET',
            path: `/addresses/${addressId}`,
        });
        return response;
    }
}
//# sourceMappingURL=address.bitpwr.js.map