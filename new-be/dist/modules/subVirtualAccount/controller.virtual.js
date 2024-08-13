import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { ApiError } from '../errors';
import { catchAsync } from '../utils';
import { easyPick } from '../utils/pick';
import { deleteVirtualAccountById, deleteVirtualAccountByUserId, getSubAccountBalanceByUserId, getSubAccountTransactionByUserId, getVirtualAccountById, getVirtualAccountByUserId, initCreateVirtualAccount, queryVirtualAccounts, } from './service.virtual';
// Adjust the paths accordingly
// Use the catchAsync middleware to handle asynchronous errors
/* The `createVirtualSubAccountController` is a controller function that handles the creation of a
virtual sub-account. It is an asynchronous function that uses the `catchAsync` middleware to handle
any errors that may occur during the execution of the function. */
export const createVirtualSubAccountController = catchAsync(async (req, res) => {
    const { user } = req;
    const virtualAccount = await initCreateVirtualAccount({
        bvn: req.body.bvn,
        user,
        phoneNumber: req.body.phoneNumber,
    });
    // const resp = {
    //   status: virtualAccount.status,
    //   message: virtualAccount.message,
    //   data: {
    //     url: virtualAccount.data.url,
    //   },
    // };
    res.status(httpStatus.CREATED).send(virtualAccount);
});
/* The `getAllVirtualSubAccountsController` function is a controller function that handles the
retrieval of all virtual sub-accounts. It uses the `catchAsync` middleware to handle any errors that
may occur during the execution of the function. */
export const getAllVirtualSubAccountsController = catchAsync(async (req, res) => {
    const filter = easyPick(req.query, [
        'status',
        'bankName',
        'accountNumber',
        'accountReferenceFlw',
        'accRef',
    ]); // Adjust the filtering as needed
    const options = easyPick(req.query, ['sort', 'limit', 'page', 'projectBy']); // Adjust the options as needed
    const virtualAccounts = await queryVirtualAccounts(filter, options);
    res.send(virtualAccounts);
});
export const getVirtualSubAccountByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const virtualAccount = await getVirtualAccountById(new Types.ObjectId(id));
    if (!virtualAccount) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Virtual Account not found');
    }
    res.send(virtualAccount);
});
export const getVirtualSubAccountByUserIdController = catchAsync(async (req, res) => {
    const { user } = req;
    const virtualAccount = await getVirtualAccountByUserId(new Types.ObjectId(user._id));
    if (!virtualAccount) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Virtual Account not found');
    }
    res.send(virtualAccount);
});
export const deleteVirtualSubAccountByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedVirtualAccount = await deleteVirtualAccountById(new Types.ObjectId(id));
    res.send(deletedVirtualAccount);
});
export const deleteVirtualSubAccountByUserIdController = catchAsync(async (req, res) => {
    const { user } = req;
    const deletedVirtualAccount = await deleteVirtualAccountByUserId(new Types.ObjectId(user._id));
    res.send(deletedVirtualAccount);
});
export const getSubAccountBalanceByUserIdController = catchAsync(async (req, res) => {
    const { user } = req;
    const balance = await getSubAccountBalanceByUserId(new Types.ObjectId(user._id));
    res.send(balance);
});
export const getSubAccountTransactionByUserIdController = catchAsync(async (req, res) => {
    const { user } = req;
    const queryDate = req.query; // Adjust the query parameters as needed
    const q = { currency: 'NGN', from: queryDate['from'], to: queryDate['to'] };
    const transactions = await getSubAccountTransactionByUserId(new Types.ObjectId(user._id), q);
    res.send(transactions);
});
//# sourceMappingURL=controller.virtual.js.map