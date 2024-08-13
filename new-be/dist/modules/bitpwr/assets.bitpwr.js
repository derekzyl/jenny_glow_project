export class AssetsBitpwr {
    constructor(base) {
        this.base = base;
    }
    /**
     * The function creates assets by making a POST request to a specified path with the provided data.
     *
     * @param data The `data` parameter is an object of type `CreateBitpwrWalletAssetPayloadI`. It
     * contains the necessary information to create a new asset in a Bitpwr wallet.
     *
     * @return a Promise that resolves to an object of type CreateBitPwrWalletAssetResponseI.
     */
    async createAssets(data) {
        const { data: response } = await this.base.request({
            method: 'POST',
            path: '/assets',
            data,
        });
        return response;
    }
    /**
     * The function `getAssets` is an asynchronous function that takes an `accountId` and `page` as
     * parameters and returns a promise that resolves to a `ManyBitpwrWalletAssetsI` object.
     *
     * @param  - `accountId`: The ID of the account for which the assets are being retrieved.
     *
     * @return a Promise that resolves to an object of type ManyBitpwrWalletAssetsI.
     */
    async getAssets({ accountId, page }) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: '/assets',
            data: { includeQueryParams: true, accountId, page },
        });
        return response;
    }
    /**
     * The function `getAssetsById` retrieves a specific asset by its ID.
     *
     * @param assetId The assetId parameter is a string that represents the unique identifier of an
     * asset.
     *
     * @return a Promise that resolves to an object of type OneBitpwrWalletAssetsI.
     */
    async getAssetsById(assetId) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/assets/${assetId}`,
            data: { includeQueryParams: false },
        });
        return response;
    }
    /**
     * The function `getAssetAccountBalance` retrieves the balance of a specific asset for a Bitpwr
     * wallet account.
     *
     * @param assetId The assetId parameter is a string that represents the unique identifier of an
     * asset.
     *
     * @return a Promise that resolves to an object of type AccountBitpwrWalletBalanceI.
     */
    async getAssetAccountBalance(assetId) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/assets/${assetId}/balance`,
            data: { includeQueryParams: false },
        });
        return response;
    }
    /**
     * The function `getAssetAccountTransactions` retrieves multiple transactions for a specific asset
     * account.
     *
     * @param assetId The assetId parameter is a string that represents the unique identifier of an
     * asset. It is used to specify which asset's transactions you want to retrieve.
     * @param page The "page" parameter is used to specify the page number of the transactions to
     * retrieve. It is typically used for pagination purposes, where each page contains a certain number
     * of transactions. By specifying the page number, you can retrieve transactions from a specific
     * page.
     *
     * @return a Promise that resolves to an object of type ManyTransactionBitpwrResponseI.
     */
    async getAssetAccountTransactions(assetId, page) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/assets/${assetId}/transactions`,
            data: { includeQueryParams: true, page },
        });
        return response;
    }
}
//# sourceMappingURL=assets.bitpwr.js.map