/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/naming-convention */
import { ApiError } from '../errors';
import { CountryCodesEnum, CurrencyCodesEnum } from '../flutterwave/interfaces/interface.flutterwave';
import { VIRTUAL_SUB_ACCOUNTS } from '../subVirtualAccount';
import { kycService } from '../kyc';
import { getKycUserByUserId } from '../kyc/service.kyc';
import logger from '../logger/logger';
import { notificationService } from '../notification';
import { refService, refTransService } from '../referral';
import BVN_DATA from '../subVirtualAccount/models/model.bvn-data';
import { FIAT_TRANSACTIONS } from '../transactions';
import { addNewFiatPaymentTransaction, queryFiatTransactions, } from '../transactions/services/service.fiat.transactions';
import { getUserById, verifyUserWithPin } from '../user/service.user';
import { generateAlphanumericReference } from '../utils';
import checkKeys from '../utils/checkKeys';
import { GeneratePrefixType, GeneratekeyE, easyReferenceGenerator } from '../utils/referenceGenerator';
import { FIAT_WALLETS } from '../wallet';
import { exchangeFiat, getFiatWalletByUserIdAndCurrencyCode } from '../wallet/services/service.fiat.wallet';
import httpStatus from 'http-status';
import { fiatTransactionStatus, transactionTypes } from '../../config/transactions';
import { createBulkTransfer, createTransfer, getAllTransfers, getBankBranches, getBanks, getTransferById, getTransferFee, retryTransfer, verifyAccountNumber, } from './api/api.transfers';
import TRANSFERS from './model.transfers';
/**
 * Calculate the daily transfer cap based on the user's tier.
 *
 * @param {number} tier - The user's tier.
 * @returns {number} The corresponding daily transfer cap.
 * @throws {Error} Throws an error for unknown tiers.
 */
const calculateDailyTransferCap = (tier) => {
    switch (tier) {
        case 3:
            return Infinity;
        case 2:
            return 200e3;
        case 1:
            return 50e3;
        case 0:
            return 20e3;
        default:
            // Handle unknown tier
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Unknown tier: ${tier}`);
    }
};
/**
 * Check if a user has maxed the number of fiat transactions in a day and also if the user has some level of KYC.
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<boolean>}
 */
export const permitUserFiatTransaction = async (userId, amount) => {
    try {
        const kycUser = await getKycUserByUserId(userId);
        if (!kycUser) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User KYC profile not found');
        }
        // Daily transfer cap
        const dailyTransferCap = calculateDailyTransferCap(kycUser.tier);
        // Calculate the cumulative transactions done in a day
        const filter = {
            userId,
            date: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lt: new Date().setHours(23, 59, 59, 999), // End of the day
            },
        };
        const transactionsResult = await queryFiatTransactions(filter, {});
        const cumulativeAmount = transactionsResult.results.reduce((total, transaction) => total + transaction.amount, 0);
        if (cumulativeAmount + amount > dailyTransferCap) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Exceeded daily transfer limit');
        }
        return true;
    }
    catch (error) {
        // Handle and log any errors that occur during the process.
        logger.error('An error occurred during fiat transaction permit check:', error);
        throw error;
    }
};
/**
 * The function `createTransferService` is an asynchronous function that creates a transfer by
 * verifying the user's account number and making sure the account name is valid.
 * @param {ITransferCreateServicePayload} request - The `request` parameter is an object of type
 * `ITransferCreateServicePayload`. It contains the following properties:
 * @returns the result of the `createTransfer` function call.
 */
export const createTransferService = async (request) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19;
    try {
        const { user } = request;
        const veri = await verifyUserWithPin(user.id, request.userTransactionPin);
        if (!veri)
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid pin');
        // first we get the user account number
        const permitTransaction = await permitUserFiatTransaction(user.id, request.amount);
        if (!permitTransaction) {
            throw new ApiError(httpStatus.FORBIDDEN, 'transaction not permitted.');
        }
        if (Number(request.amount) > 500000)
            throw new ApiError(httpStatus.BAD_REQUEST, 'amount exceeded 500,000NGN per transfer');
        if (Number(request.amount) < 100)
            throw new ApiError(httpStatus.BAD_REQUEST, 'amount must be 100NGN and above');
        // first we get the user account number
        const userAcc = await VIRTUAL_SUB_ACCOUNTS.findOne({ userId: user.id });
        if (!userAcc)
            throw new Error('kindly create an account number to proceed with transfer');
        const userBvn = await BVN_DATA.findOne({ _id: userAcc === null || userAcc === void 0 ? void 0 : userAcc.bvnData });
        if (!userBvn)
            throw new Error('kindly create an account number to proceed with transfer');
        const wallet = await FIAT_WALLETS.findOne({
            userId: user.id,
            currencyCode: CurrencyCodesEnum.Nigeria,
        });
        if (!wallet) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'failed to create a transfer');
        }
        if (wallet.balance < request.amount)
            throw new ApiError(httpStatus.BAD_REQUEST, 'insufficient funds kindly ');
        // we check the validity of the account number by making sure the name of the account transfer is valid
        const checkKys = checkKeys(request, [
            'bankCode',
            'amount',
            'accountNumber',
            'accountName',
        ]);
        if (!checkKys)
            throw new ApiError(httpStatus.BAD_REQUEST, 'kindly provide the valid details for transfer ');
        // next we use the bank id and account number to verify the account number
        const verifyAccount = await verifyAccountNumber({
            account_bank: request.bankCode,
            account_number: request.accountNumber,
        });
        if (!verifyAccount)
            throw new ApiError(httpStatus.BAD_REQUEST, 'kindly provide the valid details for transfer ');
        if (verifyAccount.data.account_name !== request.accountName)
            throw new ApiError(httpStatus.BAD_REQUEST, 'kindly provide the valid details for transfer');
        // we use the bank id and account number to verify the account number
        // const getTransferFe = await getTransferFee({ amount: request.amount, currency: CurrencyCodesEnum.Nigeria });
        const generateRef = generateAlphanumericReference(16, GeneratekeyE.alphanumLower, GeneratePrefixType.TRANSFER);
        const getKyc = await kycService.getKycUserByUserId(user.id);
        let meta = [];
        switch (request.bankCode) {
            case '101' /* providus bank */:
                meta = [
                    {
                        sender: userAcc.accountName,
                        sender_address: (_a = userBvn.lgaOfResidence) !== null && _a !== void 0 ? _a : '10 eyeye street',
                        sender_city: (_b = userBvn.lgaOfResidence) !== null && _b !== void 0 ? _b : ' delta state',
                        sender_country: CountryCodesEnum.Nigeria,
                        sender_id_number: (_c = String(userBvn.AccountId)) !== null && _c !== void 0 ? _c : '1903839344',
                        sender_mobile_number: (_e = (_d = userBvn.phoneNumber1) !== null && _d !== void 0 ? _d : getKyc === null || getKyc === void 0 ? void 0 : getKyc.phoneNumber) !== null && _e !== void 0 ? _e : '0800000000000',
                        sender_email_address: (_f = userBvn.email) !== null && _f !== void 0 ? _f : user.email,
                        first_name: (_g = verifyAccount.data.account_name.split(' ')[0]) !== null && _g !== void 0 ? _g : '',
                        last_name: (_h = verifyAccount.data.account_name.split(' ')[1]) !== null && _h !== void 0 ? _h : '',
                        recipient_address: (_j = userBvn.lgaOfResidence) !== null && _j !== void 0 ? _j : '10 eyeye street',
                        beneficiary_state: (_k = userBvn.stateOfResidence) !== null && _k !== void 0 ? _k : 'delta state',
                        beneficiary_country: CountryCodesEnum.Nigeria,
                        beneficiary_mobile_number: (_l = userBvn.phoneNumber1) !== null && _l !== void 0 ? _l : getKyc === null || getKyc === void 0 ? void 0 : getKyc.phoneNumber,
                        routing_number: (_m = userBvn.productReference) !== null && _m !== void 0 ? _m : '00001',
                        account_number: verifyAccount.data.account_number,
                    },
                ];
                break;
            case '070' /* fidelity bank */:
                meta = [
                    {
                        sender: userAcc.accountName,
                        first_name: (_o = verifyAccount.data.account_name.split(' ')[0]) !== null && _o !== void 0 ? _o : '',
                        last_name: (_p = verifyAccount.data.account_name.split(' ')[1]) !== null && _p !== void 0 ? _p : '',
                        email: user.email,
                        beneficiary_country: 'Nigeria',
                        mobile_number: (_q = userBvn.phoneNumber1) !== null && _q !== void 0 ? _q : getKyc === null || getKyc === void 0 ? void 0 : getKyc.phoneNumber,
                        merchant_name: userAcc.bankName,
                    },
                ];
                break;
            case '178' /* union bank */:
                meta = [
                    {
                        sender: userAcc.accountName,
                        first_name: (_r = verifyAccount.data.account_name.split(' ')[0]) !== null && _r !== void 0 ? _r : '',
                        last_name: (_s = verifyAccount.data.account_name.split(' ')[1]) !== null && _s !== void 0 ? _s : '',
                        email: user.email,
                        beneficiary_country: 'Nigeria',
                        mobile_number: (_t = userBvn.phoneNumber1) !== null && _t !== void 0 ? _t : getKyc === null || getKyc === void 0 ? void 0 : getKyc.phoneNumber,
                        merchant_name: userAcc.bankName,
                    },
                ];
                break;
            case '186' /* fcmb */:
                meta = [
                    {
                        sender: userAcc.accountName,
                        sender_address: (_u = userBvn.lgaOfResidence) !== null && _u !== void 0 ? _u : '10 eyeye street',
                        sender_city: (_v = userBvn.lgaOfResidence) !== null && _v !== void 0 ? _v : 'delta state',
                        sender_country: CountryCodesEnum.Nigeria,
                        sender_id_number: (_w = String(userBvn.nin)) !== null && _w !== void 0 ? _w : '1903839344',
                        sender_mobile_number: (_x = userBvn.phoneNumber1) !== null && _x !== void 0 ? _x : getKyc === null || getKyc === void 0 ? void 0 : getKyc.phoneNumber,
                        sender_id_type: 'nin',
                        sender_id_expiry: '',
                        sender_occupation: 'business',
                        sender_beneficiary_relationship: 'business',
                        recipient_address: (_y = userBvn.lgaOfResidence) !== null && _y !== void 0 ? _y : 'sapele',
                        beneficiary_country: CountryCodesEnum.Nigeria,
                        mobile_number: (_z = userBvn.phoneNumber1) !== null && _z !== void 0 ? _z : getKyc === null || getKyc === void 0 ? void 0 : getKyc.phoneNumber,
                        email: (_0 = userBvn.email) !== null && _0 !== void 0 ? _0 : user.email,
                        beneficiary_occupation: 'business',
                        transfer_purpose: (_1 = request.narration) !== null && _1 !== void 0 ? _1 : 'transfer',
                    },
                ];
                break;
            default:
                meta = [
                    {
                        sender: userAcc.accountName,
                        first_name: (_2 = verifyAccount.data.account_name.split(' ')[0]) !== null && _2 !== void 0 ? _2 : '',
                        last_name: (_3 = verifyAccount.data.account_name.split(' ')[1]) !== null && _3 !== void 0 ? _3 : '',
                        beneficiary_country: CountryCodesEnum.Nigeria,
                        mobile_number: (_4 = userBvn.phoneNumber1) !== null && _4 !== void 0 ? _4 : getKyc === null || getKyc === void 0 ? void 0 : getKyc.phoneNumber,
                        email: user.email,
                        merchant_name: userAcc.bankName,
                    },
                ];
                break;
        }
        // this checks the user account balnace in fiat
        const getTrxFee = await getTransferFeeService({ amount: request.amount });
        logger.info(`{getTrxFee}: ${JSON.stringify(getTrxFee)}`);
        // const createTrans = await createTransfer({
        //   account_bank: request.bankCode,
        //   account_number: verifyAccount.data.account_number,
        //   amount: request.amount,
        //   currency: CurrencyCodesEnum.Nigeria,
        //   debit_currency: CurrencyCodesEnum.Nigeria,
        //   reference: generateRef,
        //   narration: request.narration ?? 'transfer',
        //   meta,
        // });
        let createTrans;
        try {
            createTrans = await createTransfer({
                account_bank: request.bankCode,
                account_number: verifyAccount.data.account_number,
                amount: request.amount,
                currency: CurrencyCodesEnum.Nigeria,
                debit_currency: CurrencyCodesEnum.Nigeria,
                reference: generateRef,
                narration: (_5 = request.narration) !== null && _5 !== void 0 ? _5 : 'transfer',
                meta,
            });
            if (createTrans) {
                let newAmount = request.amount;
                if (request.useRefBonus && request.useRefBonus === true) {
                    const getRef = await refService.getReferralByUserId(request.user.id);
                    if (getRef) {
                        const bal = getRef.refBalance;
                        if (getRef.refBalance >= request.amount) {
                            getRef.refBalance -= request.amount;
                            await getRef.save();
                            await refTransService.createRefTransation({
                                amount: request.amount,
                                fee: 0,
                                referral: request.user.id,
                                status: 'SUCCESS',
                                transType: 'WITHDRAWAL',
                                userId: request.user.id,
                                type: 'TRANSFER',
                                reference: easyReferenceGenerator({
                                    size: 16,
                                    addDash: true,
                                    prefix: GeneratePrefixType.REFERRAL,
                                    type: GeneratekeyE.alphanumLower,
                                }),
                            });
                            newAmount = 0;
                        }
                        else if (request.amount > getRef.refBalance) {
                            newAmount = request.amount - getRef.refBalance;
                            getRef.refBalance = 0;
                            await getRef.save();
                            await refTransService.createRefTransation({
                                amount: bal,
                                fee: 0,
                                referral: request.user.id,
                                status: 'SUCCESS',
                                transType: 'WITHDRAWAL',
                                userId: request.user.id,
                                type: 'TRANSFER',
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
                    await exchangeFiat(wallet, CurrencyCodesEnum.Nigeria, Number(newAmount) + (getTrxFee && getTrxFee.data && getTrxFee.data[0] ? getTrxFee.data[0].fee : 10), 'SEND');
            }
        }
        catch (createTransferError) {
            await FIAT_TRANSACTIONS.create({
                userId: user.id,
                walletId: wallet._id,
                type: transactionTypes.fiatTransfer,
                ref: generateRef,
                amount: request.amount,
                currency: CurrencyCodesEnum.Nigeria,
                status: fiatTransactionStatus.failed,
                providerTransactionId: null,
                narration: (_6 = request.narration) !== null && _6 !== void 0 ? _6 : 'transfer',
                fiatTransfer: {
                    recipientAccountNumber: request.accountNumber,
                    recipientBankName: null,
                    recipientFullName: null,
                    recipientBankCode: request.bankCode,
                },
                fee: null,
                meta,
                currencyCode: CurrencyCodesEnum.Nigeria,
                date: new Date(),
            });
            await TRANSFERS.create({
                userId: user.id,
                txId: easyReferenceGenerator({
                    size: 10,
                    prefix: GeneratePrefixType.NONE,
                    addDash: false,
                    type: GeneratekeyE.numbers,
                }),
                bankCode: request.bankCode,
                fullName: request.accountName,
                status: fiatTransactionStatus.failed,
                reference: generateRef,
                currency: CurrencyCodesEnum.Nigeria,
                amount: request.amount,
                debitCurrency: CurrencyCodesEnum.Nigeria,
                fee: null,
                narration: (_7 = request.narration) !== null && _7 !== void 0 ? _7 : 'transfer',
                meta,
                transferType: 'TRANSFER',
                bankName: null,
                accountNumber: request.accountNumber,
                isApproved: 0,
                requiresApproval: 0,
                completeMessage: ((_9 = (_8 = createTransferError === null || createTransferError === void 0 ? void 0 : createTransferError.response) === null || _8 === void 0 ? void 0 : _8.data) === null || _9 === void 0 ? void 0 : _9.message) || createTransferError.message || '',
                merchantName: null, // No merchant name due to failure
            });
            throw createTransferError; // Re-throw the error to be handled by the outer catch block
        }
        await FIAT_TRANSACTIONS.create({
            userId: user.id,
            walletId: wallet._id,
            type: transactionTypes.fiatTransfer,
            ref: createTrans.data.reference,
            amount: request.amount,
            currency: CurrencyCodesEnum.Nigeria,
            status: fiatTransactionStatus.pending,
            providerTransactionId: createTrans.data.id,
            narration: (_10 = createTrans.data.narration) !== null && _10 !== void 0 ? _10 : 'transfer',
            fiatTransfer: {
                recipientAccountNumber: createTrans.data.account_number,
                recipientBankName: createTrans.data.bank_name,
                recipientFullName: createTrans.data.full_name,
                recipientBankCode: createTrans.data.bank_code,
            },
            fee: createTrans.data.fee,
            meta: createTrans.data.meta,
            currencyCode: createTrans.data.currency,
            date: createTrans.data.created_at,
        });
        await TRANSFERS.create({
            userId: user.id,
            txId: createTrans.data.id,
            bankCode: createTrans.data.bank_code,
            fullName: createTrans.data.full_name,
            status: fiatTransactionStatus.pending,
            reference: createTrans.data.reference,
            currency: createTrans.data.currency,
            amount: createTrans.data.amount,
            debitCurrency: (_11 = createTrans.data.debit_currency) !== null && _11 !== void 0 ? _11 : 'NGN',
            fee: (_12 = createTrans.data.fee) !== null && _12 !== void 0 ? _12 : 0,
            narration: (_13 = createTrans.data.narration) !== null && _13 !== void 0 ? _13 : 'transfer',
            meta: (_14 = createTrans.data) !== null && _14 !== void 0 ? _14 : 'transfer',
            transferType: 'TRANSFER',
            bankName: (_15 = createTrans.data.bank_name) !== null && _15 !== void 0 ? _15 : 'nuban',
            accountNumber: createTrans.data.account_number,
            isApproved: (_16 = createTrans.data.is_approved) !== null && _16 !== void 0 ? _16 : 0,
            requiresApproval: (_17 = createTrans.data.requires_approval) !== null && _17 !== void 0 ? _17 : 0,
            completeMessage: (_18 = createTrans.data.complete_message) !== null && _18 !== void 0 ? _18 : '',
            merchantName: (_19 = createTrans.data.MerchantName) !== null && _19 !== void 0 ? _19 : 'none',
        });
        return createTrans;
    }
    catch (error) {
        throw error;
    }
};
/**
 * The function `verifyAccountNumberService` verifies an account number by using the bank ID and
 * account number.
 * @param {IAccountPayload} request - The `request` parameter is an object of type `IAccountPayload`
 * which contains the following properties:
 * @returns The function `verifyAccountNumberService` returns the result of the `verifyAccountNumber`
 * function, which is the account details of the provided bank code and account number.
 */
export const verifyAccountNumberService = async (request) => {
    // we use the bank id and account number to verify the account number
    const getAccountDetails = await verifyAccountNumber({
        account_bank: request.bankCode,
        account_number: request.accountNumber,
    });
    return getAccountDetails;
};
/**
 * The function `getBanksService` retrieves a list of banks based on the specified country ID,
 * defaulting to Nigeria.
 * @param {CountryCodesEnum} countryId - The `countryId` parameter is of type `CountryCodesEnum`, which
 * is an enumeration representing different country codes. In this case, the default value is set to
 * `CountryCodesEnum.Nigeria`.
 * @returns The function `getBanksService` returns the result of the `getBanks` function, which is
 * awaited using the `await` keyword.
 */
export const getBanksService = async (countryId = CountryCodesEnum.Nigeria) => {
    const getBank = await getBanks(countryId);
    return getBank;
};
/**
 * The function `getOneBankService` retrieves information about a specific bank based on its code and
 * country.
 * @param {string} bankCode - The `bankCode` parameter is a string that represents the code of a
 * specific bank. It is used to identify the bank within the list of banks returned by the
 * `getBanksService` function.
 * @param {CountryCodesEnum} countryId - The `countryId` parameter is a string representing the country
 * code. It is optional and defaults to "Nigeria" if not provided.
 * @returns The function `getOneBankService` returns a Promise that resolves to an object with the
 * properties `id`, `name`, and `code`.
 */
export const getOneBankService = async (bankCode, countryId = CountryCodesEnum.Nigeria) => {
    const bank = await getBanksService(countryId);
    const getBank = bank.data.find((b) => b.code === bankCode);
    if (!getBank)
        throw new Error('bank not found');
    return getBank;
};
/**
 * The function `getBankBranchesService` retrieves bank branches for a given bank ID.
 * @param {string} bankId - The `bankId` parameter is a string that represents the unique identifier of
 * a bank.
 * @returns The function `getBankBranchesService` returns a promise that resolves to the bank branches
 * for the specified `bankId`.
 */
export const getBankBranchesService = async (bankId) => {
    const bankBranches = await getBankBranches(bankId);
    return bankBranches;
};
/**
 * The `_TransferHandler` function handles the creation of a bulk transfer by verifying the account
 * details, generating a reference, and preparing the necessary metadata based on the bank code.
 * @param {IBulkTransferData} request - The `request` parameter is an object that contains the details
 * of the transfer request. It includes properties such as `bankCode` (the code of the bank where the
 * transfer is being made), `amount` (the amount to be transferred), `accountNumber` (the account
 * number of the recipient
 * @param {IUserDoc} user - The `user` parameter is of type `IUserDoc` and represents the user document
 * in the database. It contains information about the user such as their name, email, and other
 * details.
 * @param {IVirtualSubAccountDoc} userAcc - The `userAcc` parameter is of type `IVirtualSubAccountDoc`
 * and represents the virtual sub-account of the user.
 * @param {IBvnDataDoc} userBvn - The parameter `userBvn` is of type `IBvnDataDoc` and represents the
 * Bank Verification Number (BVN) data of the user.
 * @returns the `data` object.
 */
const _TransferHandler = async (request, user, userAcc, userBvn) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        // we check the validity of the account number by making sure the name of the account transfer is valid
        const checkKys = checkKeys(request, [
            'bankCode',
            'amount',
            'accountNumber',
            'accountName',
        ]);
        if (!checkKys)
            throw new ApiError(httpStatus.BAD_REQUEST, 'kindly provide the valid details for transfer');
        // next we use the bank id and account number to verify the account number
        const verifyAccount = await verifyAccountNumber({
            account_bank: request.bankCode,
            account_number: request.accountNumber,
        });
        if (!verifyAccount)
            throw new ApiError(httpStatus.BAD_REQUEST, 'kindly provide the valid details for transfer');
        if (verifyAccount.data.account_name !== request.accountName)
            throw new ApiError(httpStatus.BAD_REQUEST, 'kindly provide the valid details for transfer');
        // we use the bank id and account number to verify the account number
        // todo const getTransferFe = await getTransferFee({ amount: request.amount, currency: CurrencyCodesEnum.Nigeria });
        const generateRef = generateAlphanumericReference(16, GeneratekeyE.alphanumLower, GeneratePrefixType.TRANSFER);
        let meta = [];
        switch (request.bankCode) {
            case '101' /* providus bank */:
                {
                    meta = [
                        {
                            sender: userAcc.accountName,
                            sender_address: userBvn.lgaOfResidence,
                            sender_city: userBvn.lgaOfResidence,
                            sender_country: CountryCodesEnum.Nigeria,
                            sender_id_number: String(userBvn.AccountId),
                            sender_mobile_number: userBvn.phoneNumber1,
                            sender_email_address: userBvn.email,
                            first_name: (_a = verifyAccount.data.account_name.split(' ')[0]) !== null && _a !== void 0 ? _a : '',
                            last_name: (_b = verifyAccount.data.account_name.split(' ')[1]) !== null && _b !== void 0 ? _b : '',
                            recipient_address: userBvn.lgaOfResidence,
                            beneficiary_state: userBvn.stateOfResidence,
                            beneficiary_country: CountryCodesEnum.Nigeria,
                            beneficiary_mobile_number: userBvn.phoneNumber1,
                            routing_number: userBvn.productReference,
                            account_number: verifyAccount.data.account_number,
                        },
                    ];
                }
                break;
            case '070' /* fidelity bank */:
                {
                    meta = [
                        {
                            sender: userAcc.accountName,
                            first_name: (_c = verifyAccount.data.account_name.split(' ')[0]) !== null && _c !== void 0 ? _c : '',
                            last_name: (_d = verifyAccount.data.account_name.split(' ')[1]) !== null && _d !== void 0 ? _d : '',
                            email: user.email,
                            beneficiary_country: 'Nigeria',
                            mobile_number: userBvn.phoneNumber1,
                            merchant_name: userAcc.bankName,
                        },
                    ];
                }
                break;
            case '178' /* union bank */:
                {
                    meta = [
                        {
                            sender: userAcc.accountName,
                            first_name: (_e = verifyAccount.data.account_name.split(' ')[0]) !== null && _e !== void 0 ? _e : '',
                            last_name: (_f = verifyAccount.data.account_name.split(' ')[1]) !== null && _f !== void 0 ? _f : '',
                            email: user.email,
                            beneficiary_country: 'Nigeria',
                            mobile_number: userBvn.phoneNumber1,
                            merchant_name: userAcc.bankName,
                        },
                    ];
                }
                break;
            case '186' /* fcmb */:
                {
                    meta = [
                        {
                            sender: userAcc.accountName,
                            sender_address: userBvn.lgaOfResidence,
                            sender_city: userBvn.lgaOfResidence,
                            sender_country: CountryCodesEnum.Nigeria,
                            sender_id_number: String(userBvn.nin),
                            sender_mobile_number: userBvn.phoneNumber1,
                            sender_id_type: 'nin',
                            sender_id_expiry: '',
                            sender_occupation: 'business',
                            sender_beneficiary_relationship: 'business',
                            recipient_address: userBvn.lgaOfResidence,
                            beneficiary_country: CountryCodesEnum.Nigeria,
                            mobile_number: userBvn.phoneNumber1,
                            email: userBvn.email,
                            beneficiary_occupation: 'business',
                            transfer_purpose: (_g = request.narration) !== null && _g !== void 0 ? _g : 'transfer',
                        },
                    ];
                }
                break;
            default:
                meta = [
                    {
                        sender: userAcc.accountName,
                        first_name: (_h = verifyAccount.data.account_name.split(' ')[0]) !== null && _h !== void 0 ? _h : '',
                        last_name: (_j = verifyAccount.data.account_name.split(' ')[1]) !== null && _j !== void 0 ? _j : '',
                        beneficiary_country: CountryCodesEnum.Nigeria,
                        mobile_number: userBvn.phoneNumber1,
                        email: user.email,
                        merchant_name: userAcc.bankName,
                    },
                ];
                break;
        }
        const data = {
            bank_code: request.bankCode,
            account_number: verifyAccount.data.account_number,
            amount: request.amount,
            currency: CurrencyCodesEnum.Nigeria,
            reference: generateRef,
            narration: (_k = request.narration) !== null && _k !== void 0 ? _k : 'transfer',
            meta,
        };
        return data;
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to create bulk a transfer');
    }
};
/**
 * The function `createBulkTransferService` creates a bulk transfer by retrieving user account
 * information and processing each transfer data.
 * @param {IBulkTransferSchema} request - The `request` parameter is an object of type
 * `IBulkTransferSchema`. It contains the following properties:
 * @returns the result of the `createBulkTransfer` function call.
 */
export const createBulkTransferService = async (request) => {
    var _a;
    try {
        // first we get the user account number
        const userAcc = await VIRTUAL_SUB_ACCOUNTS.findOne({ userId: request.user._id });
        if (!userAcc)
            throw new Error('kindly create an account number to proceed with transfer');
        const userBvn = await BVN_DATA.findOne({ id: userAcc === null || userAcc === void 0 ? void 0 : userAcc.bvnData });
        if (!userBvn)
            throw new Error('kindly create an account number to proceed with transfer');
        const dat = [];
        for (const d of request.bulkData) {
            dat.push(await _TransferHandler(d, request.user, userAcc, userBvn));
        }
        const bulkT = {
            bulk_data: dat,
            title: (_a = request.title) !== null && _a !== void 0 ? _a : '',
        };
        const createBulkTrans = await createBulkTransfer(bulkT);
        return createBulkTrans;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to create bulk a transfer');
    }
};
/**
 * The function `getTransferFeeService` is an asynchronous function that retrieves the transfer fee for
 * a given amount in a specific currency.
 * @param request - The `request` parameter is an object that contains the `amount` property, which is
 * a number representing the transfer amount.
 * @returns The function `getTransferFeeService` is returning the result of the `getTransferFee`
 * function call.
 */
export const getTransferFeeService = async (request) => {
    try {
        const getTransferFe = await getTransferFee({ amount: request.amount, currency: CurrencyCodesEnum.Nigeria });
        return getTransferFe;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to get transfer fee');
    }
};
/**
 * The function `getAllTransfersFromFlw` retrieves all transfers based on the provided parameters from
 * a third-party API.
 * @param param - The parameter `param` is an object with the following properties:
 * @returns The function `getAllTransfersFromFlw` is returning the result of the `getAllTransfers`
 * function call.
 */
export const getAllTransfersFromFlw = async ({ page = '1', status = 'successful', from = '1', to = '50', }) => {
    try {
        const param = {
            page,
            status,
            from,
            to,
        };
        const getAlltrns = await getAllTransfers(param);
        return getAlltrns;
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to get transfer');
    }
};
/**
 * The function `getTransferByIdFromFlw` retrieves a transfer by its ID from a source called `Flw`.
 * @param {string} transferId - The `transferId` parameter is a string that represents the unique
 * identifier of a transfer.
 * @returns The function `getTransferByIdFromFlw` returns a promise that resolves to the value of
 * `trns` if the `getTransferById` function is successful. If there is an error, it throws an
 * `ApiError` with a status code of `httpStatus.BAD_REQUEST` and a message of 'failed to get transfer'.
 */
export const getTransferByIdFromFlw = async (transferId) => {
    try {
        const trns = await getTransferById(transferId);
        return trns;
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to get transfer');
    }
};
/**
 * The function `getTransferByIdService` retrieves a transfer by its ID and throws an error if the
 * transfer is not found or if there is an error in retrieving the transfer.
 * @param request - The parameter `request` is of type `Types.ObjectId`. It is used to identify the
 * transfer that needs to be retrieved from the database.
 * @returns the transfer object if it is found, otherwise it is throwing an error with a status code of
 * 400 and a message of 'transfer not found'. If there is any other error during the process, it will
 * throw an error with a status code of 400 and a message of 'failed to get transfer'.
 */
export const getTransferByIdService = async (request) => {
    try {
        const getTrans = await TRANSFERS.findById(request);
        if (!getTrans)
            throw new ApiError(httpStatus.BAD_REQUEST, 'transfer not found');
        return getTrans;
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to get transfer');
    }
};
/**
 * The function `retryTransferService` retries a transfer using the `retryTransfer` function and throws
 * an `ApiError` if it fails.
 * @param {string} transferId - The `transferId` parameter is a string that represents the unique
 * identifier of a transfer.
 * @returns The function `retryTransferService` returns the result of the `retryTransfer` function
 * call.
 */
export const retryTransferService = async (transferId) => {
    try {
        const rtry = await retryTransfer(transferId);
        return rtry;
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to retry transfer');
    }
};
// export const walletToWalletService = async (request) => {
//   try {
//     const wtw = await walletToWallet(request);
//     return wtw;
//   } catch (error) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'failed to retry transfer');
//   }
// };
/**
 * The function `getUserTransfer` retrieves a transfer object based on the provided user ID and
 * transfer ID.
 * @param userId - The `userId` parameter is the unique identifier of the user for whom we want to
 * retrieve the transfer. It is of type `Types.ObjectId`, which is typically used in MongoDB to
 * represent unique identifiers for documents.
 * @param transferId - The `transferId` parameter is the unique identifier of the transfer that you
 * want to retrieve. It is of type `Types.ObjectId`, which is typically used in MongoDB to represent
 * unique identifiers for documents in a collection.
 * @returns the transfer object that matches the given userId and transferId.
 */
export const getUserTransfer = async (userId, transferId) => {
    try {
        const getTrans = await TRANSFERS.findOne({ userId, _id: transferId });
        return getTrans;
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to get transfer');
    }
};
/**
 * The function `getAllUserTransfers` retrieves all transfers associated with a specific user ID.
 * @param request - The parameter `request` is of type `Types.ObjectId`. It is used to specify the user
 * ID for which the transfers need to be retrieved.
 * @returns the result of the query to find all transfers in the TRANSFERS collection where the userId
 * matches the provided request parameter.
 */
export const getAllUserTransfers = async (request) => {
    try {
        const getTrans = await TRANSFERS.find({ userId: request });
        return getTrans;
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to get transfer');
    }
};
/**
 * The function `adminTransferToUser` is used to create a bulk transfer from an admin account to a user
 * account.
 * @param {ITransferCreateServicePayload} req - The parameter `req` is of type
 * `ITransferCreateServicePayload`.
 * @returns the result of the `createTransfer` function call, which is stored in the `createBulkTrans`
 * variable.
 */
export const adminTransferToUser = async (req) => {
    var _a;
    try {
        const userAcc = await VIRTUAL_SUB_ACCOUNTS.findOne({ userId: req.user._id });
        if (!userAcc)
            throw new Error('kindly create an account number to proceed with transfer');
        const userBvn = await BVN_DATA.findOne({ id: userAcc === null || userAcc === void 0 ? void 0 : userAcc.bvnData });
        if (!userBvn)
            throw new Error('kindly create an account number to proceed with transfer');
        const dat = await _TransferHandler({
            accountName: req.accountName,
            accountNumber: req.accountNumber,
            bankCode: req.bankCode,
            amount: req.amount,
            currency: CurrencyCodesEnum.Nigeria,
        }, req.user, userAcc, userBvn);
        const createBulkTrans = await createTransfer({
            account_bank: dat.bank_code,
            account_number: dat.account_number,
            amount: dat.amount,
            currency: dat.currency,
            meta: dat.meta,
            debit_currency: dat.currency,
            narration: (_a = dat.narration) !== null && _a !== void 0 ? _a : '',
            reference: dat.reference,
        });
        return createBulkTrans;
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to create bulk a transfer');
    }
};
export const swapTransferService = async (request) => {
    try {
        const userAcc = await VIRTUAL_SUB_ACCOUNTS.findOne({ userId: request.user._id });
        if (!userAcc)
            throw new Error('kindly create an account number to proceed with transfer');
        const userBvn = await BVN_DATA.findOne({ id: userAcc === null || userAcc === void 0 ? void 0 : userAcc.bvnData });
        if (!userBvn)
            throw new Error('kindly create an account number to proceed with transfer');
        const dat = await _TransferHandler({
            accountName: request.accountName,
            accountNumber: request.accountNumber,
            bankCode: request.bankCode,
            amount: request.amount,
            currency: CurrencyCodesEnum.Nigeria,
        }, request.user, userAcc, userBvn);
        return dat;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'failed to create bulk a transfer');
    }
};
export const createTransferForDbUser = async (request, userId) => {
    try {
        const createTrans = await TRANSFERS.create(Object.assign({ userId }, request));
        return createTrans;
    }
    catch (error) {
        logger.error(error);
        throw new ApiError(httpStatus.BAD_REQUEST, error);
    }
};
export const updateTransferServiceWithRef = async (request, reference) => {
    try {
        const updateTrans = await TRANSFERS.updateOne({ reference }, request);
        return updateTrans;
    }
    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error);
    }
};
/**
 * Transfers funds from a user to the admin.
 *
 * @param {mongoose.Types.ObjectId} userId - The ID of the user initiating the transfer.
 * @param {number} amount - The amount to be transferred.
 * @param {transactionTypes} transactionType - The type of transaction (e.g., fiatDeposit).
 * @param {'WEBHOOK' | 'USER'} mode - The mode of the transfer (WEBHOOK or USER).
 * @param {string} [userTransactionPin] - The user's transaction PIN (optional for 'WEBHOOK' mode).
 * @throws {ApiError} Throws an error if the user is not found or if the transfer cannot be processed.
 */
export const userTransferToAdminService = async (userId, amount, transactionType, mode, userTransactionPin) => {
    // Retrieve user by ID
    try {
        let user = await getUserById(userId);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        // Check if userTransactionPin is required and provided
        if (mode !== 'WEBHOOK' && userTransactionPin !== undefined) {
            user = await verifyUserWithPin(userId, userTransactionPin);
        }
        else {
            throw new ApiError(httpStatus.BAD_REQUEST, 'User transaction pin is required');
        }
        // Prepare payload for the transfer request
        const transferRequestPayload = {
            user,
            userTransactionPin,
            amount,
            bankCode: '<flw admin bank code>',
            accountNumber: '<flw admin account number>',
            accountName: '<flw admin account name>',
            narration: `${transactionType}`,
        };
        // Create transfer service request
        const fiatTxResponse = await createTransferService(transferRequestPayload);
        if (!fiatTxResponse) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to process transfer request');
        }
        // Check if the transfer status is nil
        if (fiatTxResponse.data.status !== 'nil') {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to process transfer response');
        }
        const wallet = await getFiatWalletByUserIdAndCurrencyCode(user.id, 'NGN');
        if (!wallet) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
        }
        await addNewFiatPaymentTransaction({
            amount: fiatTxResponse.data.amount,
            date: new Date(fiatTxResponse.data.created_at),
            ref: fiatTxResponse.data.reference,
            userId: user.id,
            fee: fiatTxResponse.data.fee,
            type: transactionType,
            fiatDeposit: {
                senderAccountNumber: fiatTxResponse.data.account_number,
                senderBankName: fiatTxResponse.data.bank_name,
                senderBankCode: fiatTxResponse.data.bank_code,
                senderFullName: fiatTxResponse.data.full_name,
            },
            narration: fiatTxResponse.data.narration,
            providerTransactionId: String(fiatTxResponse.data.id),
            currencyCode: fiatTxResponse.data.currency,
            walletId: wallet.id,
        });
    }
    catch (error) {
        notificationService.sendNotificationToStaffs({
            title: 'Error Processing User Transfer to Admin',
            body: `User ID: ${userId}\nAmount: ${amount}\nTransaction Type: ${transactionType}\nMode: ${mode}\nError: ${error}`,
            nType: 'both',
            type: 'ERROR sending to admin',
            permissions: ['ALL_STAFFS'],
        });
        logger.error(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to process user transfer to admin');
    }
};
//# sourceMappingURL=service.transfers.js.map