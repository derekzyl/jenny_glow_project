import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import * as fiatTransactionsService from '../services/service.fiat.transactions';
export const getFiatTransactions = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['referenceId', 'status', 'type', 'walletId', 'userId', 'id']);
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await fiatTransactionsService.queryFiatTransactions(filter, options);
    res.send(result);
});
export const getFiatTransaction = catchAsync(async (req, res) => {
    if (typeof req.params['transactionId'] === 'string') {
        const transaction = await fiatTransactionsService.getFiatTransactionById(new mongoose.Types.ObjectId(req.params['transactionId']));
        if (!transaction) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
        }
        res.send(transaction);
    }
});
export const getUserFiatTransactions = catchAsync(async (req, res) => {
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await fiatTransactionsService.getFiatTransactionsByUserId(req.user._id, options);
    res.send(result);
});
export const getUserFiatTransaction = catchAsync(async (req, res) => {
    if (typeof req.params['transactionId'] === 'string') {
        const transaction = await fiatTransactionsService.getFiatTransactionByUserId(new mongoose.Types.ObjectId(req.params['transactionId']), req.user._id);
        if (!transaction) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
        }
        res.send(transaction);
    }
});
export const verifyPaymentTransaction = catchAsync(async (req, res) => {
    const params = pick(req.query, ['tx_ref', 'transaction_id', 'status']);
    // const options: IOptions = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    // const result = await userService.queryUsers(filter, options);
    if (typeof params.tx_ref === 'string' && typeof params.transaction_id === 'string') {
        const transaction = await fiatTransactionsService.verifyPaymentTransaction(params.tx_ref, params.transaction_id, params.status);
        if (!transaction) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
        }
        res.send(transaction);
    }
});
//# sourceMappingURL=controller.fiat.transactions.js.map