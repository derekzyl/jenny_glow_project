/* eslint-disable default-case */
import { ApiError } from '../errors';
import { logger } from '../logger';
import { sendNotification } from '../notification/service.notification';
import { refService, refTransService } from '../referral';
import { fiatTransactionsService } from '../transactions';
import { verifyUserWithPin } from '../user/service.user';
import { generateAlphanumericReference } from '../utils';
import { easyReferenceGenerator, GeneratekeyE, GeneratePrefixType } from '../utils/referenceGenerator';
import { fiatWalletService } from '../wallet';
import { getFiatWalletByUserIdAndCurrencyCode } from '../wallet/services/service.fiat.wallet';
import httpStatus from 'http-status';
import { createBillPaymentAPI, getBillCategoriesAPI, validateBillAPI, verifyBillPaymentStatusAPI } from './api/api.bill';
import BILLS from './model.bill';
/**
 * Create Bill Payment
 * @param {string} createBillPaymentBody
 * @returns {Promise<IBillPaymentDoc>}
 */
export const createBillPayment = async (createBillPaymentBody) => {
    // validate pin
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    const user = await verifyUserWithPin(createBillPaymentBody.userId, createBillPaymentBody.userTransactionPin);
    const wallet = await getFiatWalletByUserIdAndCurrencyCode(user.id, 'NGN');
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'wallet not found');
    }
    const reference = generateAlphanumericReference(16);
    if (await BILLS.isExists(reference)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Bill Payment Order already exists');
    }
    // debit wallet balance
    if (wallet.balance < createBillPaymentBody.amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient wallet balance');
    }
    try {
        const request = {
            country: 'NG',
            customer: createBillPaymentBody.customer,
            amount: createBillPaymentBody.amount,
            recurrence: 'ONCE',
            reference,
            type: createBillPaymentBody.type,
            biller_name: createBillPaymentBody.billerName,
        };
        const da = await createBillPaymentAPI(request);
        if (da && da.status === 'success') {
            let newAmount = createBillPaymentBody.amount;
            if (createBillPaymentBody.useRefBonus && createBillPaymentBody.useRefBonus === true) {
                const getRef = await refService.getReferralByUserId(createBillPaymentBody.userId);
                if (getRef) {
                    const bal = getRef.refBalance;
                    if (getRef.refBalance >= createBillPaymentBody.amount) {
                        getRef.refBalance -= createBillPaymentBody.amount;
                        await getRef.save();
                        await refTransService.createRefTransation({
                            amount: createBillPaymentBody.amount,
                            fee: 0,
                            referral: createBillPaymentBody.userId,
                            status: 'SUCCESS',
                            transType: 'WITHDRAWAL',
                            userId: createBillPaymentBody.userId,
                            type: 'BILLS',
                            reference: easyReferenceGenerator({
                                size: 16,
                                addDash: true,
                                prefix: GeneratePrefixType.REFERRAL,
                                type: GeneratekeyE.alphanumLower,
                            }),
                        });
                        newAmount = 0;
                    }
                    else if (createBillPaymentBody.amount > getRef.refBalance) {
                        newAmount = createBillPaymentBody.amount - getRef.refBalance;
                        getRef.refBalance = 0;
                        await getRef.save();
                        await refTransService.createRefTransation({
                            amount: bal,
                            fee: 0,
                            referral: createBillPaymentBody.userId,
                            status: 'SUCCESS',
                            transType: 'WITHDRAWAL',
                            userId: createBillPaymentBody.userId,
                            type: 'BILLS',
                            reference: easyReferenceGenerator({
                                size: 16,
                                addDash: true,
                                prefix: GeneratePrefixType.REFERRAL,
                                type: GeneratekeyE.alphanumLower,
                            }),
                        });
                    }
                }
            }
            if (newAmount > 0)
                wallet.balance -= newAmount;
        }
        await wallet.save();
        if (!da)
            throw new ApiError(httpStatus.BAD_REQUEST, `error occurred while  purchasing bills`);
        const { data } = da;
        const getTx = await verifyBillPaymentStatusAPI(data.reference);
        if (!getTx)
            throw new ApiError(httpStatus.BAD_REQUEST, `error occurred while  purchasing bills`);
        const dx = getTx.data;
        const bills = await BILLS.create({
            txRef: (_a = dx.tx_ref) !== null && _a !== void 0 ? _a : data.tx_ref,
            flwRef: (_b = dx.flw_ref) !== null && _b !== void 0 ? _b : data.flw_ref,
            status: (_c = getTx.status) !== null && _c !== void 0 ? _c : da.status,
            userId: user.id,
            walletId: wallet.id,
            country: (_d = dx.country) !== null && _d !== void 0 ? _d : request.country,
            amount: data.amount,
            customer: (_e = dx.customer_id) !== null && _e !== void 0 ? _e : request.customer,
            billerName: (_f = dx.product_name) !== null && _f !== void 0 ? _f : request.biller_name,
            type: request.type,
            reference: (_g = data.reference) !== null && _g !== void 0 ? _g : request.reference,
            recurrence: (_h = dx.frequency) !== null && _h !== void 0 ? _h : request.recurrence,
            token: dx.extra,
        });
        let Bill;
        (function (Bill) {
            Bill["AIRTIME"] = "AIRTIME";
            Bill["DATA_BUNDLE"] = "DATA_BUNDLE";
            Bill["POWER"] = "POWER";
            Bill["INTERNET"] = "INTERNET";
            Bill["TOLL"] = "TOLL";
            Bill["CABLE"] = "CABLE";
        })(Bill || (Bill = {}));
        const walletId = await fiatWalletService.getFiatWalletByUserIdAndCurrencyCode(user.id, 'NGN');
        const transactionBody = {
            userId: user.id,
            walletId: walletId === null || walletId === void 0 ? void 0 : walletId.id,
            type: request.type,
            ref: (_j = data.reference) !== null && _j !== void 0 ? _j : request.reference,
            amount: (_k = dx.amount) !== null && _k !== void 0 ? _k : data.amount,
            flwRef: (_l = dx.flw_ref) !== null && _l !== void 0 ? _l : data.flw_ref,
            fee: 0,
            swap: false,
            status: (_m = getTx.status) !== null && _m !== void 0 ? _m : da.status,
        };
        switch (request.type) {
            case Bill.AIRTIME: {
                const airtime = {
                    airtimeRecipientNumber: (_o = dx.customer_id) !== null && _o !== void 0 ? _o : data.phone_number,
                    network: data.network,
                };
                transactionBody.airtime = airtime;
                break;
            }
            case Bill.DATA_BUNDLE: {
                const dataBundle = {
                    airtimeRecipientNumber: (_p = dx.customer_id) !== null && _p !== void 0 ? _p : data.phone_number,
                    network: data.network,
                };
                transactionBody.data = dataBundle;
                break;
            }
            case Bill.POWER: {
                const power = {
                    meterAddress: (_q = dx.product) !== null && _q !== void 0 ? _q : '',
                    meterNumber: (_r = dx.customer_id) !== null && _r !== void 0 ? _r : data.phone_number,
                    meterToken: (_s = dx.extra) !== null && _s !== void 0 ? _s : '',
                };
                transactionBody.electricity = power;
                break;
            }
            case Bill.INTERNET: {
                const x = {
                    airtimeRecipientNumber: (_t = dx.customer_id) !== null && _t !== void 0 ? _t : data.phone_number,
                    network: (_u = dx.product) !== null && _u !== void 0 ? _u : data.network,
                };
                transactionBody.internet = x;
                break;
            }
            case Bill.TOLL: {
                const x = {
                    airtimeRecipientNumber: (_v = dx.customer_id) !== null && _v !== void 0 ? _v : data.phone_number,
                    network: (_w = dx.product) !== null && _w !== void 0 ? _w : data.network,
                };
                transactionBody.toll = x;
                break;
            }
            case Bill.CABLE: {
                const x = {
                    airtimeRecipientNumber: (_x = dx.customer_id) !== null && _x !== void 0 ? _x : data.phone_number,
                    network: (_y = dx.product) !== null && _y !== void 0 ? _y : data.network,
                };
                transactionBody.cable = x;
                break;
            }
        }
        await fiatTransactionsService.addNewFiatPaymentTransaction(transactionBody);
        await sendNotification({
            body: `${request.type} purchase was successful with the transaction id of ${data.reference} \n product: ${(_z = dx.product) !== null && _z !== void 0 ? _z : data.network} \n ${request.type === 'POWER' ? `token :${dx.extra}` : ''}`,
            nType: 'notification',
            title: 'bill payment',
            type: 'bills',
            userId: user.id,
        });
        return bills;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Failed to create bill payment.${JSON.stringify(error)}`);
    }
};
/**
 * Query bill payments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryBillPayments = async (filter, options) => {
    const billPayments = await BILLS.paginate(filter, options);
    return billPayments;
};
/**
 * Get bill payment by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IBillPaymentDoc | null>}
 */
export const getBillPaymentById = async (id) => BILLS.findById(id);
/**
 * Get bill payments by user id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<QueryResult>}
 */
export const getBillPaymentsByUserId = async (userId, options) => {
    const res = await queryBillPayments({ userId }, options);
    return res;
};
export async function getUserBillPayment({ userId, billId, }) {
    const bill = await BILLS.findOne({ userId, _id: billId });
    return bill;
}
/**
 * Validate customer's details
 * @param {string} customer
 * @param {string} billerCode
 * @param {string} itemCode
 * @returns {Promise<NewBillPaymentValidationResponse>}
 */
export const validateBillPayment = async (customer, billerCode, itemCode) => {
    try {
        const request = {
            customer,
            code: billerCode,
            item_code: itemCode,
        };
        const response = await validateBillAPI(request);
        const data = Object.assign(Object.assign({}, response.data), { billerCode: response.data.biller_code, productCode: response.data.product_code });
        return data;
    }
    catch (error) {
        const message = 'Failed to validate bill payment details.';
        logger.error(message, error);
        throw new ApiError(httpStatus.BAD_REQUEST, message);
    }
};
export const getBillCategories = async (req) => {
    try {
        const bills = await getBillCategoriesAPI(req);
        return bills;
    }
    catch (e) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to fetch bill categories.');
    }
};
//# sourceMappingURL=service.bill-payment.js.map