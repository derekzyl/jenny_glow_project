import { ApiError } from '../errors';
import { CountryCodesEnum } from '../flutterwave/interfaces/interface.flutterwave';
import { catchAsync } from '../utils';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { transferService } from '.';
// Use the catchAsync middleware to handle asynchronous errors
export const createTransferServiceController = catchAsync(async (req, res) => {
    const { user } = req;
    const createTrans = await transferService.createTransferService(Object.assign(Object.assign({}, req.body), { user }));
    res.status(httpStatus.CREATED).send(createTrans);
});
export const verifyAccountNumberServiceController = catchAsync(async (req, res) => {
    const accountDetails = await transferService.verifyAccountNumberService(req.body);
    res.send(accountDetails);
});
export const getBanksServiceController = catchAsync(async (_req, res) => {
    const banks = await transferService.getBanksService(CountryCodesEnum.Nigeria);
    res.send(banks);
});
export const getOneBankServiceController = catchAsync(async (req, res) => {
    const { bankCode } = req.params;
    if (!bankCode)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Bank code is required');
    const bank = await transferService.getOneBankService(bankCode, CountryCodesEnum.Nigeria);
    res.send(bank);
});
export const getBankBranchesServiceController = catchAsync(async (req, res) => {
    const { bankId } = req.params;
    if (!bankId)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Bank id is required');
    const bankBranches = await transferService.getBankBranchesService(bankId);
    res.send(bankBranches);
});
export const createBulkTransferController = catchAsync(async (req, res) => {
    const bulkTransfer = await transferService.createBulkTransferService(req.body);
    res.status(httpStatus.CREATED).send(bulkTransfer);
});
export const getTransferFeeController = catchAsync(async (req, res) => {
    const transferFee = await transferService.getTransferFeeService(req.body);
    res.send(transferFee);
});
export const getAllTransfersController = catchAsync(async (req, res) => {
    const { from, to, page, status } = req.query;
    const transfers = await transferService.getAllTransfersFromFlw({ from, to, page, status });
    res.send(transfers);
});
export const getTransferByIdController = catchAsync(async (req, res) => {
    if (!req.params['transferId'])
        throw new ApiError(httpStatus.BAD_REQUEST, 'Transfer id is required');
    const transferId = parseInt(req.params['transferId'], 10);
    const transfer = await transferService.getTransferByIdFromFlw(transferId);
    res.send(transfer);
});
export const getTransferByIdServiceController = catchAsync(async (req, res) => {
    const transferId = new Types.ObjectId(req.params['transferId']);
    const transfer = await transferService.getTransferByIdService(transferId);
    res.send(transfer);
});
export const retryTransferController = catchAsync(async (req, res) => {
    const { transferId } = req.params;
    if (!transferId)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Transfer id is required');
    const retryResult = await transferService.retryTransferService(transferId);
    res.send(retryResult);
});
export const getUserTransferController = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const transferId = new Types.ObjectId(req.params['transferId']);
    const userTransfer = await transferService.getUserTransfer(userId, transferId);
    res.send(userTransfer);
});
export const getAllUserTransfersController = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const userTransfers = await transferService.getAllUserTransfers(userId);
    res.send(userTransfers);
});
export const adminTransferToUserController = catchAsync(async (req, res) => {
    const adminTransfer = await transferService.adminTransferToUser(req.body);
    res.send(adminTransfer);
});
export const swapTransferController = catchAsync(async (req, res) => {
    const swapTransfer = await transferService.swapTransferService(req.body);
    res.send(swapTransfer);
});
export const createTransferForDbUserController = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const createTransferResult = await transferService.createTransferForDbUser(req.body, userId);
    res.send(createTransferResult);
});
export const updateTransferWithRefController = catchAsync(async (req, res) => {
    const { referenceId } = req.params;
    if (!referenceId)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Reference id is   required');
    const updateResult = await transferService.updateTransferServiceWithRef(req.body, referenceId);
    res.send(updateResult);
});
//# sourceMappingURL=controller.transfers.js.map