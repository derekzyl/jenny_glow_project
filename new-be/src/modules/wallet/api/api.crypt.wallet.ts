import BitPwr from '@modules/bitpwr';
import logger from '@modules/logger/logger';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../../../config/config';
import {
  CoinDataResponse,
  CreateSubAccountAddressPayloadT,
  CreateSubAccountPayloadT,
} from './interface.api.wallet.ts/interface.api.crypto';

const bpwr = new BitPwr(String(config.bitpwr.key), String(config.bitpwr.secret));

/**
 * The function `createUserSubAccount` creates a sub account using the Bitpwr API and returns the
 * response, or throws an error if the creation fails.
 *
 * @param payload The `payload` parameter is an object that contains the necessary information to
 * create a sub account. It should have the following properties:
 *
 * @return the response from the `createSubAccountBitpwr` method.
 */
export async function createUserSubAccount(payload: CreateSubAccountPayloadT) {
  try {
    const response = await bpwr.SubAccountBitpwr.createSubAccountBitpwr({ ...payload, autoGenerateAddress: false });
    return response;
  } catch (error) {
    logger.error(`error ocurred while create  sub accounts from bitpwr: ${String(error)}`);
    throw new Error('failed to create  sub accounts');
  }
}

/**
 * The function creates a crypto wallet address for a sub-account using the Bitpwr API.
 *
 * @param payload The `payload` parameter is an object that contains the necessary information to
 * create a sub-account address for a crypto wallet. The specific properties of the `payload` object
 * are not provided in the code snippet, so you would need to refer to the documentation or code
 * implementation to determine the required properties and their
 *
 * @return the response from the `createSubAccountAddressBitpwr` function call.
 */
export async function createCryptoWalletAddress(payload: CreateSubAccountAddressPayloadT) {
  try {
    const response = await bpwr.SubAccountBitpwr.createSubAccountAddressBitpwr({
      ...payload,
    });
    return response;
  } catch (error) {
    logger.error(`error ocurred while  sub account addresses from bitpwr: ${String(error)}`);
    throw new Error('failed to create sub account addresses');
  }
}

/**
 * The function `getSubAccountBalance` is an asynchronous function that takes in an `accountId` and
 * `subAccountId` as parameters and returns the balance of the sub-account.
 *
 * @param  - `accountId`: The ID of the main account.
 */
export async function getSubAccountBalance({ accountId, subAccountId }: { accountId: string; subAccountId: string }) {
  try {
    const data = await bpwr.SubAccountBitpwr.getSubAccountBalanceBitpwr(accountId, subAccountId);
    return data;
  } catch (e: any) {
    logger.error(`error ocurred while fetching sub account balance from bitpwr: ${String(e)}`);
    throw new Error('failed to get sub account balance');
  }
}

/**
 * The function `getWalletAddressAccountBalance` is an asynchronous function that retrieves the balance
 * of a wallet address using the `AddressBitpwr.getAddressBalance` method and returns the data.
 *
 * @param addressId The `addressId` parameter is a string that represents the unique identifier of a
 * wallet address. It is used to fetch the account balance associated with that address.
 *
 * @return the data fetched from the `bpwr.AddressBitpwr.getAddressBalance` function.
 */
export async function getWalletAddressAccountBalance(addressId: string) {
  try {
    const data = await bpwr.AddressBitpwr.getAddressBalance(addressId);
    return data;
  } catch (e) {
    logger.error(`error occurred while fetching address balance`);
    throw new Error('failed to get address balance');
  }
}

/**
 * The function `getBitpwrAssetsAddressBySubAccountIdsAssets` retrieves addresses associated with a sub
 * account from Bitpwr.
 *
 * @param subAccountId The `subAccountId` parameter is a string that represents the ID of a
 * sub-account.
 *
 * @return the data fetched from the `bpwr.AddressBitpwr.getAddresses` method.
 */
export async function getBitpwrAssetsAddressBySubAccountIdsAssets(subAccountId: string) {
  try {
    const data = await bpwr.AddressBitpwr.getAddresses({ subAccountId });
    return data;
  } catch (error: any) {
    logger.error(`error ocurred while fetching sub account assets from bitpwr: ${String(error)}`);
    throw new Error('failed to get sub account assets');
  }
}

/**
 * The function `getBitpwrAssetsAddressByAssetId` retrieves addresses from Bitpwr based on the
 * provided asset ID.
 *
 * @param assetId The parameter `assetId` is a string that represents the ID of an asset.
 *
 * @return the data fetched from the Bitpwr API, which is a list of addresses associated with the
 * specified assetId.
 */
export async function getBitpwrAssetsAddressByAssetId(assetId: string) {
  try {
    const data = await bpwr.AddressBitpwr.getAddresses({ assetId });
    return data;
  } catch (error: any) {
    logger.error(`error ocurred while fetching  assets from bitpwr: ${String(error)}`);
    throw new Error('failed to get  assets');
  }
}
/**
 * The function `getBitpwrAddressById` retrieves a user account address from Bitpwr using the provided
 * address ID.
 *
 * @param addressId The `addressId` parameter is a string that represents the unique identifier of an
 * address in the Bitpwr system.
 *
 * @return the data fetched from the Bitpwr API for the specified addressId.
 */
export async function getBitpwrAddressById(addressId: string) {
  try {
    const data = await bpwr.AddressBitpwr.getOneAddress(addressId);
    return data;
  } catch (error: any) {
    logger.error(` error occurred fetching the user account address  from bitpwr: ${String(error)} `);
    throw new Error('failed to get  address');
  }
}

// ************************
// |    Admin Purposes    |
// ************************
// 1)  get all accounts
// 2) get account balance
// 3)  get assets
// 4)  create assets

/**
 * The function `getAccountBitpwrAdminAccounts` is an asynchronous function that retrieves account data
 * from Bitpwr and handles any errors that occur during the process.
 *
 * @param  - `getAccountBitpwrAdminAccounts` is an asynchronous function that takes an object as a
 * parameter.
 *
 * @return the data fetched from the `getAccount` method of the `AccountBitpwr` object.
 */
export async function getAccountBitpwrAdminAccounts({ page = 1 }: { page: number }) {
  try {
    const data = await bpwr.AccountBitpwr.getAccount({ page });
    return data;
  } catch (e: any) {
    logger.error(`error ocurred while fetching accounts from bitpwr: ${String(e)}`);
    throw new Error('failed to get accounts');
  }
}
/**
 * The function `getBitpwrAdminAccountBalance` is an asynchronous function that retrieves the account
 * balance for a given account ID from the Bitpwr API, and handles any errors that occur during the
 * process.
 *
 * @param accountId The `accountId` parameter is a string that represents the unique identifier of the
 * Bitpwr admin account for which you want to retrieve the account balance.
 *
 * @return the account balance fetched from the Bitpwr admin account.
 */
export async function getBitpwrAdminAccountBalance(accountId: string) {
  try {
    const response = await bpwr.AccountBitpwr.getAccountBalance(accountId);

    return response;
  } catch (e) {
    logger.error(`error ocurred while fetching account balance from bitpwr: ${String(e)}`);
    throw new Error('failed to get account balance');
  }
}

/**
 * The function `getBitpwrAdminSubAccounts` retrieves all sub accounts associated with a given account
 * ID from the Bitpwr platform, handling any errors that may occur.
 *
 * @param accountId The `accountId` parameter is a string that represents the ID of the main account
 * for which you want to retrieve the sub-accounts.
 *
 * @return the data fetched from the Bitpwr API for all sub accounts associated with the provided
 * account ID.
 */
export async function getBitpwrAdminSubAccounts(accountId: string) {
  try {
    const data = await bpwr.SubAccountBitpwr.getAllSubAccountsBitpwr(accountId);
    return data;
  } catch (error: any) {
    logger.error(`error ocurred while fetching sub accounts form bitpwr: ${String(error)}`);
    throw new Error('failed to get sub accounts');
  }
}
/**
 * The function `getBitpwrAdminAccountAssets` retrieves account assets from Bitpwr for a given account
 * ID, handling any errors that occur.
 *
 * @param accountId The `accountId` parameter is a string that represents the unique identifier of an
 * account in the Bitpwr system.
 *
 * @return the data fetched from the Bitpwr API for the specified account ID.
 */
export async function getBitpwrAdminAccountAssets(accountId: string) {
  try {
    const data = await bpwr.AccountBitpwr.getAccountAssets(accountId);
    return data;
  } catch (e: any) {
    logger.error(`error ocurred while fetching account assets form bitpwr: ${String(e)}`);
    throw new Error('failed to get account assets');
  }
}
/**
 * The function `getBitpwrAdminAccountsById` retrieves a single account from Bitpwr by its ID and
 * handles any errors that occur during the process.
 *
 * @param accountId The `accountId` parameter is a string that represents the unique identifier of the
 * account you want to retrieve from the Bitpwr admin accounts.
 *
 * @return the data fetched from the Bitpwr API for the specified account ID.
 */
export async function getBitpwrAdminAccountsById(accountId: string) {
  try {
    const data = await bpwr.AccountBitpwr.getAccountById(accountId);
    return data;
  } catch (e: any) {
    logger.error(`error ocurred while fetching accounts form bitpwr: ${String(e)}`);
    throw new Error('failed to get single account');
  }
}

/**
 * The function `getBitpwrAssetsAddressByAccountIdAssets` retrieves addresses associated with a
 * specific account ID from the Bitpwr API.
 *
 * @param accountId The `accountId` parameter is a string that represents the unique identifier of an
 * account. It is used to fetch the addresses associated with the specified account from the Bitpwr
 * API.
 *
 * @return the data fetched from the `bpwr.AddressBitpwr.getAddresses` API call.
 */
export async function getBitpwrAssetsAddressByAccountId(accountId: string) {
  try {
    const data = await bpwr.AddressBitpwr.getAddresses({ accountId });
    return data;
  } catch (error: any) {
    logger.error(`error ocurred while fetching  account assets from bitpwr: ${String(error)}`);
    throw new Error('failed to get  account assets');
  }
}
// 2) create Assets
/**
 * The function `createBitpwrAssetsByAdmin` creates assets using the Bitpwr API and returns the
 * response, or throws an error if the creation fails.
 *
 * @param  - `accountId`: The ID of the account for which the asset is being created.
 *
 * @return the response from the `bpwr.AssetsBitpwr.createAssets` function call.
 */
export async function createBitpwrAssetsByAdmin({
  accountId,
  label,
  asset,
}: {
  accountId: string;
  label: string;
  asset: string;
}) {
  try {
    const response = await bpwr.AssetsBitpwr.createAssets({ accountId, label, asset });
    return response;
  } catch (e: any) {
    logger.error(`error ocurred while creating asset from bitpwr: ${String(e)}`);
    throw new Error('failed to create asset');
  }
}

/**
 * The function `getBitpwrAdminAssetsByAccountId` retrieves assets from Bitpwr for a given account ID.
 *
 * @param accountId The `accountId` parameter is a string that represents the unique identifier of a
 * user's account in the Bitpwr system.
 *
 * @return the data fetched from the Bitpwr API.
 */
export async function getBitpwrAdminAssetsByAccountId(accountId: string) {
  try {
    const data = await bpwr.AssetsBitpwr.getAssets({ accountId, page: '1' });
    return data;
  } catch (error: any) {
    logger.error(`error ocurred while fetching assets from bitpwr: ${String(error)}`);
    throw new Error('failed to get assets');
  }
}

/**
 * The function `requestCoins` makes an asynchronous HTTP GET request to a specified URL and returns
 * the response data.
 *
 * @return the response data from the API call.
 */
export async function requestCoins() {
  const requestOptions: AxiosRequestConfig = {
    url: '/',
    method: 'GET',
    baseURL: `https://wise-butterfly-15.deno.dev`,

    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const { data: response }: AxiosResponse<CoinDataResponse[]> = await axios(requestOptions);

    return response;
  } catch (error: any) {
    throw new Error(error);
  }
}
