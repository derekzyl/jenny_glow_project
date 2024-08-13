/* The `TransactionBitpwr` class is a TypeScript class that provides a method for retrieving a list of
transactions based on optional filtering parameters. */
export class TransactionBitpwr {
    /**
     * The constructor function initializes an instance of a class with a given base value.
     *
     * @param base The `base` parameter is an instance of the `Base` class. It is being passed to the
     * constructor of the current class.
     */
    constructor(base) {
        this.base = base;
    }
    /**
     * The function `getTransactionListBitpwr` is an asynchronous function that retrieves a list of
     * transactions based on the provided parameters.
     *
     * @param data The `data` parameter is an object that contains optional properties for filtering
     * the transaction list.
     *
     * @return The response from the API call is being returned.
     */
    async getTransactionsListBitpwr(data) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: '/transactions',
            data: Object.assign(Object.assign({}, data), { includeQueryParams: true }),
        });
        return response;
    }
    /**
     * The function `getOneTransactionBitpwr` retrieves a single transaction from the Bitpwr API based on
     * the provided transaction ID.
     *
     * @param transactionId The transactionId parameter is a string that represents the unique identifier
     * of a transaction.
     *
     * @return a Promise that resolves to an object of type GetOneTransactionBitpwrI.
     */
    async getOneTransactionBitpwr(transactionId) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/transactions/${transactionId}`,
            data: { includeQueryParams: false },
        });
        return response;
    }
}
//# sourceMappingURL=transaction.bitpwr.js.map