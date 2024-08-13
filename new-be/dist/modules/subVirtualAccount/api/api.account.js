import Flutterwave from '../../flutterwave';
import { logger } from '../../logger';
import config from '../../../config/config';
const flw = new Flutterwave(String(config.flutterwaveAPI.key), String(config.flutterwaveAPI.secret));
/**
 * The function `verifyBvn` is an asynchronous function that takes a BVN (Bank Verification Number) as
 * input and uses the Flutterwave API to check the validity of the BVN.
 * @param request - An object containing the BVN (Bank Verification Number) to be verified.
 * @returns The function `verifyBvn` is returning the data received from the
 * `flw.VirtualAccount.checkBvn` method.
 */
export const verifyBvn = async (request) => {
    try {
        return await flw.VirtualAccount.checkBvn(request);
    }
    catch (error) {
        throw new Error(`failed to verify bvn${error}`);
    }
};
export const verifyBvnConsent = async (request) => {
    try {
        const data = await flw.SubVirtualAccount.verifyBvnData(request.bvnRef);
        return data;
    }
    catch (error) {
        throw new Error('failed to verify bvn');
    }
};
export const initCreateSubAccount = async (payload) => {
    try {
        const data = await flw.SubVirtualAccount.initCreateGetBvn(payload);
        return data;
    }
    catch (error) {
        throw new Error(`failed to create account yy${JSON.stringify(error)}`);
    }
};
/**
 * The function creates a virtual account using the provided payload and returns the created account
 * data, or throws an error if the creation fails.
 * @param {IVirtualAccountPayload} request - The `request` parameter is an object of type
 * `IVirtualAccountPayload`. It contains the necessary information to create a virtual account.
 * @returns the data object that is created by the flw.VirtualAccount.create() method.
 */
export const createSubAccount = async (request, isWebhook = false) => {
    try {
        const bvn = isWebhook ? await verifyBvnConsent({ bvnRef: request.bvnRef }) : null;
        // const b: CreateSubAccountPayload = {
        //   email: request.user.email,
        //   account_name: `${request.user.firstName} ${request.user.lastName}`,
        //   country: CountryCodesEnum.Nigeria,
        //   mobilenumber: request.phoneNumber,
        // };
        // const account = isWebhook ? null : await flw.SubVirtualAccount.create(b);
        const b = {
            bvn: request.bvn,
            email: request.user.email,
            firstname: request.user.firstName,
            lastname: request.user.lastName,
            narration: `${String(request.user.firstName).toUpperCase()} ${String(request.user.lastName).toUpperCase()} `,
            tx_ref: request.trxRef,
            phonenumber: request.phoneNumber,
        };
        const account = isWebhook ? null : await flw.VirtualAccount.create(b);
        return { account, bvn };
    }
    catch (error) {
        logger.error(`'failed to create account xx', ${error}`);
        throw new Error(`failed to create account xx ${JSON.stringify(error)}`);
    }
};
/**
 * The function creates multiple virtual accounts in bulk and returns the response.
 * @param {IBulkVirtualAccountPayload} request - The `request` parameter is of type
 * `IBulkVirtualAccountPayload`, which is an interface representing the payload for creating bulk
 * virtual accounts.
 * @returns a Promise that resolves to an IBulkVirtualAccountResponse.
 */
export const fetchSubAccount = async (request) => {
    try {
        const data = await flw.SubVirtualAccount.fetch(request);
        return data;
    }
    catch (error) {
        logger.error('error occurred fetching account', error);
        throw new Error('error occurred fetching account');
    }
};
/**
 * The function fetches bulk virtual account data and returns it as a promise.
 * @param {IFetchBulkVirtualAccountPayload} request - The `request` parameter is of type
 * `IFetchBulkVirtualAccountPayload`. It is an object that contains the necessary information to fetch
 * bulk virtual accounts.
 * @returns The function `fetchBulk` is returning a promise that resolves to an object of type
 * `IFetchBulkAccountResponse`.
 */
export const fetchBulkSubAccount = async () => {
    try {
        const data = await flw.SubVirtualAccount.fetchBulk();
        return data;
    }
    catch (error) {
        logger.error('error occurred fetching bulk account', error);
        throw new Error('error occurred fetching bulk account');
    }
};
export async function updateSubAccount(request) {
    try {
        const data = await flw.SubVirtualAccount.update(request);
        return data;
    }
    catch (error) {
        logger.error('error occurred updating account', error);
        throw new Error('error occurred updating account');
    }
}
/**
 * The function `transactions` retrieves transactions for a specific subaccount using the provided
 * account reference and query parameters.
 * @param data - The `data` parameter is an object that contains the `account_reference` property.
 * This property is of type `CreateSubAccountResponseType['data']`, which means it should have the
 * same structure as the `data` property in the `CreateSubAccountResponseType` type.
 * @param {TransactionQueryParams} queryParams - The `queryParams` parameter is an object that
 * contains optional query parameters for the transaction request. These parameters can be used to
 * filter and sort the transactions returned by the API.
 * @returns The response from the API call is being returned.
 */
export async function transactionsSubAccount(data, queryParams) {
    try {
        const da = await flw.SubVirtualAccount.transactions(data, queryParams);
        return da;
    }
    catch (error) {
        logger.error('error occurred fetching  account transaction', error);
        throw new Error('error occurred fetching  account transaction');
    }
}
/**
 * The `balance` function retrieves the balance of a subaccount based on the specified currency and
 * account reference.
 * @param queryParams - An object that contains the query parameters for the balance request. It
 * includes the 'currency' property, which specifies the currency for which the balance is requested.
 * @param data - The `data` parameter is an object that contains the `account_reference` property.
 * This property is of type `string` and represents the account reference of a subaccount.
 * @returns The response from the API call is being returned.
 */
export async function balanceSubAccount(data) {
    try {
        const da = await flw.SubVirtualAccount.balance({ currency: 'NGN' }, data);
        return da;
    }
    catch (error) {
        logger.error('error occurred fetching  account transaction', error);
        throw new Error('error occurred fetching  account transaction');
    }
}
export async function getOtherCurrencyBank(data) {
    try {
        const da = await flw.SubVirtualAccount.getOtherCurrencyBank({ currency: 'NGN' }, data);
        return da;
    }
    catch (error) {
        logger.error('error occurred fetching  bank currency', error);
        throw new Error('error occurred fetching  bank currency');
    }
}
//# sourceMappingURL=api.account.js.map