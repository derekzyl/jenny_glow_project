/* eslint-disable no-param-reassign */
import ApiError from '@modules/errors/ApiError';
import { IOptions, QueryResult } from '@modules/paginate/paginate';
import { GeneralStatus } from '@modules/utils/utils';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ITransactionDocument, NewCreatedTransaction } from '../interfaces/interfaces.transactions';
import TRANSACTION from '../models/model.transactions';


/**
 * Add a new fiat transaction
 * @param {NewCreatedTransaction} transactionBody
 * @returns {Promise<ITransactionDocument>}
 */
export const createTransaction = async (
  transactionBody: NewCreatedTransaction
): Promise<ITransactionDocument> => {
  if (await TRANSACTION.isExists(transactionBody.referenceId!)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction already exists');
  }

  const create = await TRANSACTION.create(transactionBody);
  return create;
};

/**
 * Query for fiat transactions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryTransactions = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  // If a specific date is provided, add date filtering


  const transactions = await TRANSACTION.paginate(filter, options);
  return transactions;
};

/**
 * Get fiat transaction by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ITransactionDocument | null>}
 */
export const getTransactionById = async (id: mongoose.Types.ObjectId): Promise<ITransactionDocument | null> =>
 TRANSACTION.findById(id);

/**
 * Get fiat transaction by id
 * @param {mongoose.Types.ObjectId} referenceId
 * @returns {Promise<ITransactionDocument | null>}
 */
export const getTransactionByReferenceId = async (referenceId: string): Promise<ITransactionDocument | null> =>
 TRANSACTION.findOne({ referenceId });

/**
 * Get fiat transaction by user id
 * @param {string} userId
 * @returns {Promise<IQueryResult>}
 */
export const getTransactionsByUserId = async (userId: string, options: IOptions): Promise<QueryResult> =>
  queryTransactions({ userId }, options);
/**
 * Get fiat transaction by user id
 * @param {string} userId
 * @returns {Promise<IQueryResult>}
 */
export const getTransactionByUserId = async (
  id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<ITransactionDocument | null> => TRANSACTION.findOne({ _id: id, userId });
/**
 * Get fiat transaction by user wallet id
 * @param {string} walletId
 * @returns {Promise<QueryResult>}
 */
export const getTransactionsByUserWalletId = async (walletId: string): Promise<QueryResult> =>
  queryTransactions({ walletId }, {});

/**
 * Update fiat transaction by id
 * @param {mongoose.Types.ObjectId} transactionId
 * @param {UpdateTransactionBody} updateBody
 * @returns {Promise<ITransactionDocument | null>}
 */
export const updateTransactionById = async (
  transactionId: mongoose.Types.ObjectId,
  updateBody: Partial<NewCreatedTransaction>
): Promise<ITransactionDocument | null> => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  if (updateBody.trxType && updateBody.referenceId && (await TRANSACTION.isExists(updateBody.referenceId, transactionId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction already exists');
  }
  Object.assign(transaction, updateBody);
  await transaction.save();
  return transaction;
};

/**
 * Update the status of a payment transaction.
 *
 * @param {ITransactionDocument} transaction - The transaction to update.
 * @param {string} status - The new status to set for the transaction.
 * @param {string} providerTransactionId - The provider's transaction ID.
 *
 * @returns {Promise<void>} A promise indicating the completion of the update.
 */
export const updateTransactionStatus = async (
  transaction: ITransactionDocument,
  status: GeneralStatus,
): Promise<void> => {
  const updateBody: Partial<NewCreatedTransaction> = {
    status,
  };
  if (!(await updateTransactionById(transaction.id, updateBody))) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error occurred while updating Transaction');
  }
};




