import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../errors/ApiError';
import { logger } from '../logger';
import catchAsync from '../utils/catchAsync';
import pick, { easyPick } from '../utils/pick';
import * as billPaymentService from './service.bill-payment';
/*
 BILL PAYMENTS
*/
export const createBillPayment = catchAsync(async (req, res) => {
    const { user } = req;
    const bill = await billPaymentService.createBillPayment(Object.assign({ userId: user.id }, req.body));
    res.status(httpStatus.CREATED).send(bill);
});
export const getAllBillPayments = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['baseCurrency', 'quoteCurrency', 'isActive']);
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await billPaymentService.queryBillPayments(filter, options);
    res.send(result);
});
export const getAllBillPaymentsByUserId = catchAsync(async (req, res) => {
    const { user } = req;
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await billPaymentService.getBillPaymentsByUserId(user.id, options);
    res.send(result);
});
export const getBillPayment = catchAsync(async (req, res) => {
    if (typeof req.params['id'] === 'string') {
        const billPayment = await billPaymentService.getBillPaymentById(new mongoose.Types.ObjectId(req.params['id']));
        if (!billPayment) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Bill Payment not found');
        }
        res.send(billPayment);
    }
});
export const getUserBillPayment = catchAsync(async (req, res) => {
    const { user } = req;
    if (typeof req.params['id'] === 'string') {
        const billPayment = await billPaymentService.getUserBillPayment({
            userId: user.id,
            billId: new mongoose.Types.ObjectId(req.params['id']),
        });
        if (!billPayment) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Bill Payment not found');
        }
        res.send(billPayment);
    }
});
export const validateBillPaymentDetails = catchAsync(async (req, res) => {
    const details = easyPick(req.query, ['customer', 'billerCode', 'itemCode']);
    const bill = await billPaymentService.validateBillPayment(details.customer, details.billerCode, details.itemCode);
    res.status(httpStatus.OK).send(bill);
});
export const getBillCategories = catchAsync(async (req, res) => {
    const re = req.query;
    logger.info(`billing category: ${re}`);
    const billCategories = await billPaymentService.getBillCategories(re);
    res.status(httpStatus.OK).send(billCategories);
});
//# sourceMappingURL=controller.bill-payment.js.map