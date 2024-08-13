import Flutterwave from '@modules/flutterwave';
import { AccountPayload } from '@modules/flutterwave/interfaces/interface.accounts.flutterwave';
import { logger } from '@modules/logger';
import config from '../../../config/config';
import {
  IBulkVirtualAccountPayload,
  IBulkVirtualAccountResponse,
  IBvnUpdatePayload,
  IFetchBulkAccountResponse,
  IFetchBulkVirtualAccountPayload,
  IFetchVirtualAccountPayload,
  IFetchVirtualAccountResponse,
  IVirtualAccountPayload,
} from './interface.api.account';

const flw = new Flutterwave(String(config.flutterwaveAPI.key), String(config.flutterwaveAPI.secret));
/**
 * The function `verifyBvn` is an asynchronous function that takes a BVN (Bank Verification Number) as
 * input and uses the Flutterwave API to check the validity of the BVN.
 * @param request - An object containing the BVN (Bank Verification Number) to be verified.
 * @returns The function `verifyBvn` is returning the data received from the
 * `flw.VirtualAccount.checkBvn` method.
 */
export const verifyBvn = async (request: { bvn: string }) => {
  try {
    const data = await flw.VirtualAccount.checkBvn(request);
    return data;
  } catch (error) {
    logger.error('failed to verify bvn', error);
    throw new Error('failed to verify bvn');
  }
};

/**
 * The function creates a virtual account using the provided payload and returns the created account
 * data, or throws an error if the creation fails.
 * @param {IVirtualAccountPayload} request - The `request` parameter is an object of type
 * `IVirtualAccountPayload`. It contains the necessary information to create a virtual account.
 * @returns the data object that is created by the flw.VirtualAccount.create() method.
 */
export const createAccount = async (request: IVirtualAccountPayload) => {
  try {
    const bvn = await verifyBvn({ bvn: request.bvn });

    const b: AccountPayload = {
      bvn: bvn.data.bvn,
      email: request.email,
      firstname: bvn.data.first_name,
      lastname: bvn.data.last_name,
      narration: request.narration,
      tx_ref: request.tx_ref,
      phonenumber: bvn.data.phone_number,
      amount: request.amount,
    };
    const account = await flw.VirtualAccount.create(b);
    return { account, bvn };
  } catch (error) {
    logger.error('failed to create account', error);
    throw new Error('failed to create account');
  }
};

/**
 * The function creates multiple virtual accounts in bulk and returns the response.
 * @param {IBulkVirtualAccountPayload} request - The `request` parameter is of type
 * `IBulkVirtualAccountPayload`, which is an interface representing the payload for creating bulk
 * virtual accounts.
 * @returns a Promise that resolves to an IBulkVirtualAccountResponse.
 */
export const createBulkAccount = async (request: IBulkVirtualAccountPayload): Promise<IBulkVirtualAccountResponse> => {
  try {
    const data = await flw.VirtualAccount.createBulk(request);
    return data;
  } catch (error) {
    logger.error('failed to create bulk account', error);
    throw new Error('failed to create bulk account');
  }
};

/**
 * The function fetches a virtual account using the provided request and returns the response, or
 * throws an error if an error occurs.
 * @param {IFetchVirtualAccountPayload} request - The `request` parameter is of type
 * `IFetchVirtualAccountPayload`. It is an object that contains the necessary information to fetch a
 * virtual account.
 * @returns a Promise that resolves to an object of type IFetchVirtualAccountResponse.
 */
export const fetchAccount = async (request: IFetchVirtualAccountPayload): Promise<IFetchVirtualAccountResponse> => {
  try {
    const data = await flw.VirtualAccount.fetch(request);
    return data;
  } catch (error) {
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
export const fetchBulkAccount = async (request: IFetchBulkVirtualAccountPayload): Promise<IFetchBulkAccountResponse> => {
  try {
    const data = await flw.VirtualAccount.fetchBulk(request);
    return data;
  } catch (error) {
    logger.error('error occurred fetching bulk account', error);
    throw new Error('error occurred fetching bulk account');
  }
};

/**
 * The function `updateBvn` is an asynchronous function that updates a BVN (Bank Verification Number)
 * account and returns a promise that resolves to a response object.
 * @param {IBvnUpdatePayload} request - The `request` parameter is of type `IBvnUpdatePayload`, which
 * is an interface representing the payload for updating a BVN (Bank Verification Number) account.
 * @returns The function `updateBvn` is returning a promise that resolves to an
 * `IFetchVirtualAccountResponse` object.
 */
export const updateBvn = async (request: IBvnUpdatePayload): Promise<IFetchVirtualAccountResponse> => {
  try {
    const data = await flw.VirtualAccount.updateBvn(request);
    return data;
  } catch (error) {
    logger.error('error occurred updating bvn account', error);
    throw new Error('error occurred updating bvn account');
  }
};

/**
 * The function `deleteAccount` is an asynchronous function that deletes a virtual account and returns
 * the response.
 * @param request - The `request` parameter is an object that contains the `order_ref` property.
 * @returns a Promise that resolves to an object of type IFetchVirtualAccountResponse.
 */
export const deleteAccount = async (
  request: Pick<IFetchVirtualAccountPayload, 'order_ref'>
): Promise<IFetchVirtualAccountResponse> => {
  try {
    const data = await flw.VirtualAccount.deleteAccount(request);
    return data;
  } catch (error) {
    logger.error('error occurred deleting account', error);
    throw new Error('error occurred deleting account');
  }
};
