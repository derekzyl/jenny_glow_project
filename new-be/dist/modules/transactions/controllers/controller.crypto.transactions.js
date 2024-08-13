import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import * as cryptoTransactionsService from '../services/service.crypto.transactions';
export const getCryptoTransactions = catchAsync(async (req, res) => {
    const filter = pick(req.query, [
        'fromAddress',
        'toAddress',
        'confirmations',
        'txHash',
        'status',
        'type',
        'walletId',
        'userId',
        'id',
    ]);
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await cryptoTransactionsService.queryCryptoTransactions(filter, options);
    res.send(result);
});
export const getCryptoTransaction = catchAsync(async (req, res) => {
    if (typeof req.params['transactionId'] === 'string') {
        const transaction = await cryptoTransactionsService.getCryptoTransactionById(new mongoose.Types.ObjectId(req.params['transactionId']));
        if (!transaction) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
        }
        res.send(transaction);
    }
});
export const getCryptoTransactionsByUserId = catchAsync(async (req, res) => {
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const transaction = await cryptoTransactionsService.getCryptoTransactionsByUserId(req.user.id, options);
    if (!transaction) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Transactions not found');
    }
    res.send(transaction);
});
export const getCryptoTransactionByUserId = catchAsync(async (req, res) => {
    if (typeof req.params['transactionId'] === 'string') {
        const transaction = await cryptoTransactionsService.getCryptoTransactionByUserId(new mongoose.Types.ObjectId(req.params['transactionId']), req.user.id);
        if (!transaction) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
        }
        res.send(transaction);
    }
});
// export const getBlockchainTransactionDetails = catchAsync(async (req: Request, res: Response) => {
//   const filter = pick(req.query, ['txHash', 'currencyCode']);
//   const transaction = await cryptoTransactionsService.getBlockchainTransactionDetails(
//     filter as NewBlockchainTransactionPayload
//   );
//   if (!transaction) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
//   }
//   res.send(transaction);
// });
//# sourceMappingURL=controller.crypto.transactions.js.map