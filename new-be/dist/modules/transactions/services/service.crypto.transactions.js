import ApiError from '../../errors/ApiError';
// import { getTransactionDetailsAPI } from '../../wallet/api/api.crypto.wallet';
import httpStatus from 'http-status';
import CRYPTO_TRANSACTIONS from '../models/model.crypto.transactions';
/**
 * Add a new crypto transaction
 * @param {NewCreatedCryptoTransaction} transactionBody
 * @returns {Promise<ICryptoTransactionDoc>}
 */
export const addNewCryptoPaymentTransaction = async (transactionBody) => {
    if (await CRYPTO_TRANSACTIONS.isExists(transactionBody === null || transactionBody === void 0 ? void 0 : transactionBody.type, transactionBody === null || transactionBody === void 0 ? void 0 : transactionBody.referenceId, transactionBody === null || transactionBody === void 0 ? void 0 : transactionBody.txHash)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction already exists');
    }
    return CRYPTO_TRANSACTIONS.create(transactionBody);
};
/**
 * Query for crypto transactions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCryptoTransactions = async (filter, options) => {
    const transactions = await CRYPTO_TRANSACTIONS.paginate(filter, options);
    return transactions;
};
/**
 * Get crypto transaction by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICryptoTransactionDoc | null>}
 */
export const getCryptoTransactionById = async (id) => CRYPTO_TRANSACTIONS.findById(id);
export const getCryptoTransactionsByUserId = async (userId, options) => {
    const transactions = await queryCryptoTransactions({ userId }, options);
    return transactions;
};
/**
 * Get crypto transaction by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICryptoTransactionDoc | null>}
 */
export const getCryptoTransactionByUserId = async (id, userId) => CRYPTO_TRANSACTIONS.findOne({ id, userId });
// /**
//  * Get crypto transaction by user id
//  * @param {string} userId
//  * @returns {Promise<ICryptoTransactionDoc | null>}
//  */
// export const getCryptoTransactionByUserId = async (userId: string): Promise<ICryptoTransactionDoc | null> =>
//   CRYPTO_TRANSACTIONS.findOne({ userId });
/**
 * Update crypto transaction by id
 * @param {mongoose.Types.ObjectId} transactionId
 * @param {UpdateCryptoTransactionBody} updateBody
 * @returns {Promise<ICryptoTransactionDoc | null>}
 */
export const updateCryptoTransactionById = async (transactionId, updateBody) => {
    const transaction = await getCryptoTransactionById(transactionId);
    if (!transaction) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    }
    if (updateBody.type &&
        (updateBody === null || updateBody === void 0 ? void 0 : updateBody.txHash) &&
        updateBody.referenceId &&
        (await CRYPTO_TRANSACTIONS.isExists(updateBody.type, updateBody.referenceId, updateBody === null || updateBody === void 0 ? void 0 : updateBody.txHash, transactionId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction already exists');
    }
    Object.assign(transaction, updateBody);
    await transaction.save();
    return transaction;
};
// // /**
// //  * Delete crypto transaction by id
// //  * @param {mongoose.Types.ObjectId} transactionId
// //  * @returns {Promise<ICryptoTransactionDoc | null>}
// //  */
// // export const deleteCryptoTransactionById = async (
// //   transactionId: mongoose.Types.ObjectId
// // ): Promise<ICryptoTransactionDoc | null> => {
// //   const transaction = await getCryptoTransactionById(transactionId);
// //   if (!transaction) {
// //     throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
// //   }
// //   await transaction.deleteOne();
// //   return transaction;
// // };
// /**
//  * Get transaction hash blockchain details
//  * @param {NewBlockchainTransactionPayload} transactionPayload
//  * @returns {Promise<TransactionDetailsResultAPI>}
//  * @deprecated
//  */
// export const getBlockchainTransactionDetails = async (
//   transactionPayload: NewBlockchainTransactionPayload
// ): Promise<TransactionDetailsResultAPI> => {
//   const coinCode = transactionPayload.currencyCode as SupportedCoinPaymentsSymbol;
//   const txDetails = await getTransactionDetailsAPI(transactionPayload.txHash, coinCode);
//   if (!txDetails) {
//     throw new ApiError(httpStatus.FAILED_DEPENDENCY, 'Error while sending crypto to address');
//   }
//   return txDetails;
// };
//# sourceMappingURL=service.crypto.transactions.js.map