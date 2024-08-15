import ApiError from '../../errors/ApiError';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import * as fiatTransactionsService from '../services/service.transactions';
export const getTransactions = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['referenceId', 'status', 'type', 'walletId', 'userId', 'id']);
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await fiatTransactionsService.queryTransactions(filter, options);
    res.send(result);
});
export const getTransaction = catchAsync(async (req, res) => {
    if (typeof req.params['transactionId'] === 'string') {
        const transaction = await fiatTransactionsService.getTransactionById(new mongoose.Types.ObjectId(req.params['transactionId']));
        if (!transaction) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
        }
        res.send(transaction);
    }
});
export const getUserTransactions = catchAsync(async (req, res) => {
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await fiatTransactionsService.getTransactionsByUserId(req.user._id, options);
    res.send(result);
});
export const getUserTransaction = catchAsync(async (req, res) => {
    if (typeof req.params['transactionId'] === 'string') {
        const transaction = await fiatTransactionsService.getTransactionByUserId(new mongoose.Types.ObjectId(req.params['transactionId']), req.user._id);
        if (!transaction) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
        }
        res.send(transaction);
    }
});
//# sourceMappingURL=controller.transactions.js.map