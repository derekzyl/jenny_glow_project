/* eslint-disable no-param-reassign */
import ApiError from '../../errors/ApiError';
import logger from '../../logger/logger';
import { updateFiatWalletById } from '../../wallet/services/service.fiat.wallet';
import httpStatus from 'http-status';
import { fiatTransactionStatus } from '../../../config/transactions';
import { verifyTransactionAPI } from '../api/api.fiat.transactions';
import FIAT_TRANSACTIONS from '../models/model.fiat.transactions';
/**
 * Add a new fiat transaction
 * @param {NewCreatedFiatTransaction} transactionBody
 * @returns {Promise<IFiatTransactionDoc>}
 */
export const addNewFiatPaymentTransaction = async (transactionBody) => {
    if (await FIAT_TRANSACTIONS.isExists(transactionBody.ref)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction already exists');
    }
    const create = await FIAT_TRANSACTIONS.create(transactionBody);
    return create;
};
/**
 * Query for fiat transactions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryFiatTransactions = async (filter, options) => {
    // If a specific date is provided, add date filtering
    if (filter['date']) {
        const startDate = new Date(filter['date']);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        filter['date'] = {
            $gte: startDate,
            $lt: endDate,
        };
        delete filter['date']; // Remove the original date property
    }
    const transactions = await FIAT_TRANSACTIONS.paginate(filter, options);
    return transactions;
};
/**
 * Get fiat transaction by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFiatTransactionDoc | null>}
 */
export const getFiatTransactionById = async (id) => FIAT_TRANSACTIONS.findById(id);
/**
 * Get fiat transaction by id
 * @param {mongoose.Types.ObjectId} referenceId
 * @returns {Promise<IFiatTransactionDoc | null>}
 */
export const getFiatTransactionByReferenceId = async (referenceId) => FIAT_TRANSACTIONS.findOne({ referenceId });
/**
 * Get fiat transaction by user id
 * @param {string} userId
 * @returns {Promise<IQueryResult>}
 */
export const getFiatTransactionsByUserId = async (userId, options) => queryFiatTransactions({ userId }, options);
/**
 * Get fiat transaction by user id
 * @param {string} userId
 * @returns {Promise<IQueryResult>}
 */
export const getFiatTransactionByUserId = async (id, userId) => FIAT_TRANSACTIONS.findOne({ _id: id, userId });
/**
 * Get fiat transaction by user wallet id
 * @param {string} walletId
 * @returns {Promise<QueryResult>}
 */
export const getFiatTransactionsByUserWalletId = async (walletId) => queryFiatTransactions({ walletId }, {});
/**
 * Update fiat transaction by id
 * @param {mongoose.Types.ObjectId} transactionId
 * @param {UpdateFiatTransactionBody} updateBody
 * @returns {Promise<IFiatTransactionDoc | null>}
 */
export const updateFiatTransactionById = async (transactionId, updateBody) => {
    const transaction = await getFiatTransactionById(transactionId);
    if (!transaction) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    }
    if (updateBody.type && updateBody.ref && (await FIAT_TRANSACTIONS.isExists(updateBody.ref, transactionId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction already exists');
    }
    Object.assign(transaction, updateBody);
    await transaction.save();
    return transaction;
};
/**
 * Update the status of a payment transaction.
 *
 * @param {IFiatTransactionDoc} transaction - The transaction to update.
 * @param {string} status - The new status to set for the transaction.
 * @param {string} providerTransactionId - The provider's transaction ID.
 *
 * @returns {Promise<void>} A promise indicating the completion of the update.
 */
const updateTransactionStatus = async (transaction, status, providerTransactionId) => {
    const updateBody = {
        status,
        providerTransactionId,
    };
    if (!(await updateFiatTransactionById(transaction.id, updateBody))) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error occurred while updating Transaction');
    }
};
/**
 * Update the wallet balance associated with a payment transaction.
 *
 * @param {IFiatTransactionDoc} transaction - The transaction for which to update the wallet balance.
 * @param {number} amount - The new balance amount to set for the wallet.
 *
 * @returns {Promise<void>} A promise indicating the completion of the update.
 */
const updateWalletBalance = async (transaction, amount) => {
    const updateWalletBody = { balance: amount };
    await updateFiatWalletById(transaction.walletId, updateWalletBody);
};
/**
 * Verify a payment transaction.
 *
 * @param {string} txReferenceId - The reference ID of the transaction.
 * @param {string} providerTransactionId - The provider's transaction ID.
 * @param {string} transactionStatus - The status of the transaction.
 *
 * @returns {Promise<IFiatTransactionDoc | null>} A promise that resolves to the updated transaction.
 */
export const verifyPaymentTransaction = async (txReferenceId, providerTransactionId, transactionStatus) => {
    try {
        // Retrieve the transaction by reference ID.
        const transaction = await getFiatTransactionByReferenceId(txReferenceId);
        if (!transaction) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
        }
        if (transactionStatus !== 'successful') {
            // Update transaction status to failed if the transaction was not successful.
            await updateTransactionStatus(transaction, fiatTransactionStatus.failed, providerTransactionId);
        }
        else {
            // Verify the transaction with the provider's API.
            const transactionResponse = await verifyTransactionAPI(providerTransactionId);
            // Check if the transaction details match the response.
            if (transactionResponse.data.status !== 'successful' ||
                transactionResponse.data.amount !== transaction.amount ||
                transactionResponse.data.currency !== transaction.currencyCode) {
                // Update transaction status to failed if the details do not match.
                await updateTransactionStatus(transaction, fiatTransactionStatus.failed, providerTransactionId);
            }
            else {
                // Update transaction status to successful if the details match.
                await updateTransactionStatus(transaction, fiatTransactionStatus.successful, providerTransactionId);
                // Update wallet balance
                await updateWalletBalance(transaction, transaction.amount);
            }
        }
        return transaction;
    }
    catch (error) {
        // Handle and log any errors that occur during the verification process.
        logger.error('An error occurred during transaction verification:', error);
        throw error;
    }
};
// /**
//  * Delete transaction by id
//  * @param {mongoose.Types.ObjectId} transactionId
//  * @returns {Promise<IFiatTransactionDoc | null>}
//  */
// export const deleteFiatTransactionById = async (
//   transactionId: mongoose.Types.ObjectId
// ): Promise<IFiatTransactionDoc | null> => {
//   const transaction = await getFiatTransactionById(transactionId);
//   if (!transaction) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
//   }
//   await transaction.deleteOne();
//   return transaction;
// };
//# sourceMappingURL=service.fiat.transactions.js.map