var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/* The `SubaccountBitpwr` class is responsible for creating and managing sub-accounts for a Bitpwr
account. */
export class SubAccountBitpwr {
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
     * The function creates a sub-account for a Bitpwr account using the provided data.
     *
     * @param data The `data` parameter is an object that contains the payload for creating a sub-account
     * in the Bitpwr system. It should have the following properties:
     *
     * @return a Promise that resolves to a SubAccountBitpwrCreationResponseI object.
     */
    async createSubAccountBitpwr(data) {
        const { accountId } = data, rest = __rest(data, ["accountId"]);
        const { data: response } = await this.base.request({
            method: 'POST',
            path: `/accounts/${accountId}/sub-accounts`,
            data: rest,
        });
        return response;
    }
    /**
     * The function `getAllSubAccountsBitpwr` retrieves all sub-accounts associated with a given account
     * ID from the Bitpwr API.
     *
     * @param accountId The `accountId` parameter is a string that represents the ID of the main account
     * for which you want to retrieve all the sub-accounts.
     *
     * @return a Promise that resolves to an object of type GetAllSubAccountBitpwrWalletResponseI.
     */
    async getAllSubAccountsBitpwr(accountId) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/accounts/${accountId}/sub-accounts`,
            data: { includeQueryParams: false },
        });
        return response;
    }
    /**
     * The function `getSubAccountBalanceBitpwr` retrieves the balance of a sub-account for a given
     * account ID.
     *
     * @param accountId The accountId parameter is a string that represents the ID of the main account.
     * It is used to identify the main account to which the sub-account belongs.
     * @param subAccountId The `subAccountId` parameter is a string that represents the unique identifier
     * of a sub-account.
     *
     * @return a Promise that resolves to an object of type SubAccountBalanceBitpwrResponseI.
     */
    async getSubAccountBalanceBitpwr(accountId, subAccountId) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/accounts/${accountId}/sub-accounts/${subAccountId}/balance`,
            data: { includeQueryParams: false },
        });
        return response;
    }
    /**
     * The function `getSubAccountAddressesBitpwr` retrieves the addresses associated with a sub-account
     * on the Bitpwr platform.
     *
     * @param  - `accountId`: The ID of the main account.
     *
     * @return a Promise that resolves to an object of type GetSubAccountBitpwrAddressesResponseI.
     */
    async getSubAccountAddressesBitpwr({ accountId, subAccountId, page, }) {
        const { data: response } = await this.base.request({
            method: 'GET',
            path: `/accounts/${accountId}/sub-accounts/${subAccountId}/addresses`,
            data: { includeQueryParams: true, page },
        });
        return response;
    }
    /**
     * The function creates a sub-account wallet address for a Bitpwr account.
     *
     * @param data The `data` parameter is an object that contains the following properties:
     *
     * @return a Promise that resolves to a response object of type
     * CreateSubAccountBitpwrAddressDataResponseI.
     */
    async createSubAccountAddressBitpwr(data) {
        const { accountId, subAccountId } = data, rest = __rest(data, ["accountId", "subAccountId"]);
        const { data: response } = await this.base.request({
            method: 'POST',
            path: `/accounts/${accountId}/sub-accounts/${subAccountId}/addresses`,
            data: rest,
        });
        return response;
    }
}
//# sourceMappingURL=subaccount.bitpwr.js.map