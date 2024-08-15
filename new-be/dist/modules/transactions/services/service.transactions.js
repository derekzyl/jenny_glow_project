/* eslint-disable no-param-reassign */
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import TRANSACTION from '../models/model.transactions';
/**
 * Add a new fiat transaction
 * @param {NewCreatedTransaction} transactionBody
 * @returns {Promise<ITransactionDocument>}
 */
export const createTransaction = async (transactionBody) => {
    if (await TRANSACTION.isExists(transactionBody.referenceId)) {
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
export const queryTransactions = async (filter, options) => {
    // If a specific date is provided, add date filtering
    const transactions = await TRANSACTION.paginate(filter, options);
    return transactions;
};
/**
 * Get fiat transaction by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ITransactionDocument | null>}
 */
export const getTransactionById = async (id) => TRANSACTION.findById(id);
/**
 * Get fiat transaction by id
 * @param {mongoose.Types.ObjectId} referenceId
 * @returns {Promise<ITransactionDocument | null>}
 */
export const getTransactionByReferenceId = async (referenceId) => TRANSACTION.findOne({ referenceId });
/**
 * Get fiat transaction by user id
 * @param {string} userId
 * @returns {Promise<IQueryResult>}
 */
export const getTransactionsByUserId = async (userId, options) => queryTransactions({ userId }, options);
/**
 * Get fiat transaction by user id
 * @param {string} userId
 * @returns {Promise<IQueryResult>}
 */
export const getTransactionByUserId = async (id, userId) => TRANSACTION.findOne({ _id: id, userId });
/**
 * Get fiat transaction by user wallet id
 * @param {string} walletId
 * @returns {Promise<QueryResult>}
 */
export const getTransactionsByUserWalletId = async (walletId) => queryTransactions({ walletId }, {});
/**
 * Update fiat transaction by id
 * @param {mongoose.Types.ObjectId} transactionId
 * @param {UpdateTransactionBody} updateBody
 * @returns {Promise<ITransactionDocument | null>}
 */
export const updateTransactionById = async (transactionId, updateBody) => {
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
export const updateTransactionStatus = async (transaction, status) => {
    const updateBody = {
        status,
    };
    if (!(await updateTransactionById(transaction.id, updateBody))) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error occurred while updating Transaction');
    }
};
//# sourceMappingURL=service.transactions.js.map