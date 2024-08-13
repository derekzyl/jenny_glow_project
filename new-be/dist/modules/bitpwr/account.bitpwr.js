export class AccountBitpwr {
    constructor(base) {
        this.base = base;
    }
    //! done
    /**
     * The function `getAccount` is an asynchronous function that makes a GET request to retrieve
     * multiple account data with pagination.
     *
     * @param data The `data` parameter is an object that contains two properties:
     *
     * @return a Promise that resolves to an object of type ManyAccountBitpwrWalletResponseI.
     */
    async getAccount(data) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: '/accounts',
            data: Object.assign({ includeQueryParams: false }, data),
        });
        return response;
    }
    //! done
    /**
     * The function `getAccountBalance` retrieves the balance of a Bitpwr wallet account.
     * @param {string} accountId - The `accountId` parameter is a string that represents the unique
     * identifier of an account.
     * @returns the balance of a Bitpwr wallet account.
     */
    async getAccountBalance(accountId) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/accounts/${accountId}/balance`,
            data: { includeQueryParams: false },
        });
        return response;
    }
    /**
     * The function retrieves multiple transactions for a specific account using the account ID and page
     * number.
     * @param  - - `accountId`: The ID of the account for which you want to retrieve transactions.
     * @returns the response data from the API call.
     */
    async getAccountManyTransactions({ accountId, page }) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/accounts/${accountId}/transactions`,
            data: {
                page,
                includeQueryParams: true,
            },
        });
        return response;
    }
    //! done
    /**
     * The function `getAccountOneTransaction` retrieves a specific transaction for a given account ID.
     * @param {GetOneTransactionBitpwrRequestPayloadI} data - The parameter `data` is an object that
     * contains the following properties:
     * @returns The response from the API call is being returned.
     */
    async getAccountOneTransaction(data) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/accounts/${data.accountId}/transactions/${data.transactionId}`,
            data: {
                includeQueryParams: false,
            },
        });
        return response;
    }
    //! done
    /**
     * The function `getAccountById` retrieves an account by its ID using an HTTP GET request.
     * @param {string} accountId - The `accountId` parameter is a string that represents the unique
     * identifier of an account.
     * @returns The response data from the API call is being returned.
     */
    async getAccountById(accountId) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/accounts/${accountId}`,
            data: { includeQueryParams: true },
        });
        return response;
    }
    /**
     * The function `getAccountAssets` retrieves the assets associated with a given account ID.
     * @param {string} accountId - The `accountId` parameter is a string that represents the unique
     * identifier of an account.
     * @returns The response data from the API call is being returned.
     */
    async getAccountAssets(accountId) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/accounts/${accountId}/assets`,
            data: { includeQueryParams: false },
        });
        return response;
    }
}
//# sourceMappingURL=account.bitpwr.js.map