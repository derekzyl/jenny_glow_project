import { ApiError } from '@modules/errors';
import { logger } from '@modules/logger';
import { IOptions, QueryResult } from '@modules/paginate/paginate';
import { generateAlphanumericReference } from '@modules/utils';
import { GeneratePrefixType, GeneratekeyE } from '@modules/utils/referenceGenerator';
import { FIAT_WALLETS } from '@modules/wallet';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { FiatCurrencyCodes } from '../setting/currencies';
import { createAccount } from './api/api.account';
import { IVirtualAccountPayload } from './api/interface.api.account';
import { IVirtualAccountDoc, IVirtualAccountServicePayload } from './interface.virtual';
import VIRTUAL_ACCOUNTS from './model.virtual';

/**
 * The function `createVirtualAccount` creates a virtual account for a user with the provided payload.
 * @param {IVirtualAccountServicePayload} request - The `request` parameter is an object that contains
 * the payload for creating a virtual account. It should have the following properties:
 * @returns the result of saving the virtual account object to the database.
 */
export const createVirtualAccount = async (request: Pick<IVirtualAccountServicePayload, 'bvn' | 'user'>) => {
  const transRef = generateAlphanumericReference(16, GeneratekeyE.alphanumLower, GeneratePrefixType.VIRTUAL_ACCOUNT);
  try {
    const data: IVirtualAccountPayload = {
      amount: null,
      bvn: request.bvn,
      email: request.user.email,
      tx_ref: transRef,
      narration: `account creation for  ${request.user.email}`,
    };
    let walletId = await FIAT_WALLETS.findOne({ userId: request.user._id, currencyCode: FiatCurrencyCodes.NGN });

    if (!walletId) walletId = await FIAT_WALLETS.create({ userId: request.user._id, currencyCode: FiatCurrencyCodes.NGN });

    const createNewAccount = await createAccount(data);

    if (!createNewAccount) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create virtual account');

    const virtualAccount = new VIRTUAL_ACCOUNTS({
      userId: request.user._id,
      walletId: walletId._id,
      flwRef: createNewAccount.account.data.flw_ref,
      orderRef: createNewAccount.account.data.order_ref,
      accountName: `${createNewAccount.bvn.data.first_name} ${createNewAccount.bvn.data.last_name}`,
      accountNumber: createNewAccount.account.data.account_number,
      bankName: createNewAccount.account.data.bank_name,
      createdAt: createNewAccount.account.data.created_at,
      expiryDate: createNewAccount.account.data.expiry_date,
      bvn: createNewAccount.bvn.data.bvn,
      note: createNewAccount.account.data.note,
      dateOfBirth: createNewAccount.bvn.data.date_of_birth,
      phoneNumber: createNewAccount.bvn.data.phone_number,
      nationality: createNewAccount.bvn.data.nationality,
      enrollmentBank: createNewAccount.bvn.data.enrollment_bank,
      enrollmentBranch: createNewAccount.bvn.data.enrollment_branch,
      middleName: createNewAccount.bvn.data.middle_name,
    });
    return await virtualAccount.save();
  } catch (error) {
    logger.error('failed to create virtual account', error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create virtual account');
  }
};

/**
 * ------------------------------------------------
 * fetch all virtual accounts for the admin access
 * -----------------------------------------------
 *
 * The function `queryVirtualAccounts` is a TypeScript function that queries virtual accounts based on
 * a filter and options, and returns a promise of a query result.
 * @param filter - The `filter` parameter is an object that contains the criteria for filtering the
 * virtual accounts. It can have any number of key-value pairs, where each key represents a field in
 * the virtual account and the corresponding value represents the desired value for that field. The
 * filter is used to retrieve only the virtual accounts
 * @param {IOptions} options - The `options` parameter is an object that contains additional options
 * for the query. It can have the following properties:
 * @returns a Promise that resolves to a QueryResult object.
 */
export const queryVirtualAccounts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  // Validate filter parameter
  if (!filter || typeof filter !== 'object' || Array.isArray(filter)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid filter parameter');
  }

  // Validate options parameter
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid options parameter');
  }

  // Query virtual accounts
  const virtualAccounts = await VIRTUAL_ACCOUNTS.paginate(filter, options);
  return virtualAccounts;
};
const sanitizeVirtualAccount = (virtualAccount: IVirtualAccountDoc) => {
  // Remove sensitive data from virtualAccount object
  const sanitizedVirtualAccount = { ...virtualAccount };

  // Add more sanitization logic as needed
  return sanitizedVirtualAccount;
};
/**
 * Retrieves a virtual account by its ID.
 *
 * @param {Types.ObjectId} id - The ID of the virtual account.
 * @return {Promise<VirtualAccount>} The sanitized virtual account.
 */
export const getVirtualAccountById = async (id: Types.ObjectId) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid ID');
  }

  try {
    const virtualAccount = await VIRTUAL_ACCOUNTS.findById(id);

    if (!virtualAccount) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Virtual account not found');
      // or return a default value
      // return null;
    }

    const sanitizedVirtualAccount = sanitizeVirtualAccount(virtualAccount);
    return sanitizedVirtualAccount;
  } catch (error) {
    // Handle the error here

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};

/**
 * The function `getVirtualAccountByUserId` retrieves a virtual account based on a given user ID.
 * @param userId - The `userId` parameter is of type `Types.ObjectId`. It represents the unique
 * identifier of a user.
 * @returns the virtual account associated with the given userId.
 */
export const getVirtualAccountByUserId = async (userId: Types.ObjectId) => {
  const virtualAccount = await VIRTUAL_ACCOUNTS.findOne(userId);
  return virtualAccount;
};
/**
 * The function `getVirtualAccountByWalletId` retrieves a virtual account by its wallet ID.
 * @param walletId - The `walletId` parameter is of type `Types.ObjectId`. It is used to identify a
 * specific wallet in the database.
 * @returns the virtual account associated with the given walletId.
 */
export const getVirtualAccountByWalletId = async (walletId: Types.ObjectId) => {
  const virtualAccount = await VIRTUAL_ACCOUNTS.findOne(walletId);
  return virtualAccount;
};

export const updateVirtualAccount = async () => {};

/**
 * The function `deleteVirtualAccountById` deletes a virtual account by its ID and returns the deleted
 * account.
 * @param id - The `id` parameter is of type `Types.ObjectId`. It represents the unique identifier of
 * the virtual account that needs to be deleted.
 * @returns the deleted virtual account.
 */
export const deleteVirtualAccountById = async (id: Types.ObjectId) => {
  try {
    const virtualAccount = await VIRTUAL_ACCOUNTS.findByIdAndDelete(id);
    return virtualAccount;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};

export const deleteVirtualAccountByUserId = async (userId: Types.ObjectId) => {
  try {
    const virtualAccount = await VIRTUAL_ACCOUNTS.findOneAndDelete({ userId });
    return virtualAccount;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};
