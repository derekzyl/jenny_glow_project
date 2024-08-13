/* eslint-disable import/no-cycle */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
import ApiError from '../../errors/ApiError';
import { addNewFiatPaymentTransaction } from '../../transactions/services/service.fiat.transactions';
import { getUserById } from '../../user/service.user';
import { generateAlphanumericReference, generateReference } from '../../utils';
import { GeneratePrefixType, GeneratekeyE, generateUUID } from '../../utils/referenceGenerator';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { transactionTypes } from '../../../config/transactions';
import { currencyTypes, paymentProviders } from '../../setting/currencies';
import { createPaymentAPI } from '../api/api.fiat.wallet';
import FIAT_WALLETS from '../models/model.fiat.wallet';
import { getCurrencyByCode } from './service.currency.wallet';
/*
  Fiat Currency FIAT_WALLETS
*/
/**
 * Create a fiat wallet
 * @param {NewCreatedFiatWallet} walletBody
 * @returns {Promise<IFiatWalletDoc>}
 */
export const createFiatWallet = async (walletBody) => {
    // check if user has reached a certain kyc level
    const user = await getUserById(walletBody.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const currency = await getCurrencyByCode(walletBody.currencyCode);
    if (!currency) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Unsupported currency');
    }
    if (currency.currencyType !== currencyTypes.fiat) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'currencyCode is not a fiat currency');
    }
    if (await FIAT_WALLETS.isExists(walletBody.userId, walletBody.currencyCode)) {
        throw new ApiError(httpStatus.CONFLICT, 'Wallet already exists');
    }
    return FIAT_WALLETS.create(Object.assign(Object.assign({}, walletBody), { currencyType: currency.currencyType }));
};
/**
 * Query for fiat wallets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCurrencyFiatWallets = async (filter, options) => {
    const wallets = await FIAT_WALLETS.paginate(filter, options);
    return wallets;
};
/**
 * Get all wallets that belongs to a user
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IFiatWalletDoc | null>}
 */
export const getFiatWalletsByUserId = async (userId) => {
    return queryCurrencyFiatWallets({ userId }, {});
};
/**
 * Get wallet by user id and currency code
 * @param {mongoose.Types.ObjectId} userId
 * @param {string} currencyCode
 * @returns {Promise<IFiatWalletDoc | null>}
 */
export const getFiatWalletByUserIdAndCurrencyCode = async (userId, currencyCode) => {
    const v = await FIAT_WALLETS.findOne({ userId, currencyCode });
    return v;
};
/**
 * Get exchange wallet
 * @param {string} currencyCode
 * @returns {Promise<IFiatWalletDoc | null>}
 */
export const getExchangeFiatWallet = async (currencyCode) => FIAT_WALLETS.findOne({ currencyCode, isExchange: true });
/**
 * Get wallet by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFiatWalletDoc | null>}
 */
export const getFiatWalletById = async (id) => FIAT_WALLETS.findById(id);
/**
 * Update user currency wallet by id
 * @param {mongoose.Types.ObjectId} walletId
 * @param {UpdateFiatWalletBody} updateBody
 * @returns {Promise<IFiatWalletDoc | null>}
 */
export const updateFiatWalletById = async (walletId, updateBody) => {
    const wallet = await getFiatWalletById(walletId);
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    Object.assign(wallet, updateBody);
    await wallet.save();
    return wallet;
};
/**
 * activate currency wallet by id
 * @param {mongoose.Types.ObjectId} walletId
 * @returns {Promise<IFiatWalletDoc | null>}
 */
export const activateCurrencyWalletById = async (walletId) => {
    const updateBody = { isActive: true };
    const wallet = await updateFiatWalletById(walletId, updateBody);
    return wallet;
};
/**
 * Delete currency wallet by id
 * @param {mongoose.Types.ObjectId} walletId
 * @returns {Promise<IFiatWalletDoc | null>}
 */
export const deleteCurrencyWalletById = async (walletId) => {
    const wallet = await getFiatWalletById(walletId);
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    // TODO: Before deleting move funds to another wallet
    await wallet.deleteOne();
    return wallet;
};
/**
 * Deactivate currency wallet by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {mongoose.Types.ObjectId} walletId
 * @returns {Promise<IFiatWalletDoc | null>}
 */
export const deactivateCurrencyWalletById = async (userId, walletId) => {
    // fetch user and wallet
    let wallet = await getFiatWalletById(walletId);
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    if (userId.toString() !== wallet.userId.toString()) {
        // TODO: use userId to check user roles/permissions
        throw new ApiError(httpStatus.FORBIDDEN, 'Access to Wallet not permitted');
    }
    const updateBody = { isActive: false };
    wallet = await updateFiatWalletById(walletId, updateBody);
    return wallet;
};
/*
   DEPOSITS AND WITHDRAWALS
 */
/**
 * wallet deposit by user
 * @param {NewPaymentPayload} paymentPayload
 * @returns {Promise<NewPaymentResponse | null>}
 */
export const createDepositRequest = async (paymentPayload) => {
    const wallet = await getFiatWalletById(paymentPayload.walletId);
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    if (paymentPayload.userId.toString() !== wallet.userId.toString()) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access to Wallet not permitted');
    }
    const transactionBody = {
        userId: wallet.userId,
        walletId: wallet.id,
        type: transactionTypes.fiatDeposit,
        ref: `${new Date().getFullYear()}-${generateReference(16)}`,
        amount: paymentPayload.amount,
        currencyCode: paymentPayload.currency || 'NGN',
        narration: paymentPayload.narration || '',
        providerTransactionId: '',
        paymentProvider: paymentPayload.provider || paymentProviders.flutterwave,
    };
    const fiatTx = await addNewFiatPaymentTransaction(transactionBody);
    const paymentRequest = {
        tx_ref: fiatTx.ref,
        amount: paymentPayload.amount,
        currency: paymentPayload.currency,
        redirect_url: paymentPayload.redirectUrl,
        customer: paymentPayload.customer,
    };
    const paymentResponse = await createPaymentAPI(paymentRequest);
    if (paymentResponse.status !== 'success') {
        throw new ApiError(httpStatus.PAYMENT_REQUIRED, `Error while processing deposit: ${paymentResponse.message}`);
    }
    const formattedPaymentResponse = {
        paymentLink: paymentResponse.data.link,
    };
    return formattedPaymentResponse;
};
/**
 * wallet withdrawal by user id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IFiatWalletDoc | null>}
 */
export const withdrawalRequest = async (userId, walletId, walletCurrencyType) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const wallet = await getFiatWalletById(walletId);
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    const currency = await getCurrencyByCode(wallet.currencyCode);
    if (!currency) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
    }
    if (currency.currencyType !== walletCurrencyType) {
        //
    }
    // await wallet.deleteOne();
    return wallet;
};
/**
 * The function `exchangeFiat` facilitates the exchange of fiat currency between a user's wallet and an
 * exchange wallet, handling sending and receiving modes with appropriate validations and transaction
 * updates.
 *
 * @param userWallet The `userWallet` parameter represents the user's fiat wallet from which the
 * exchange transaction will be made. It is of type `IFiatWalletDoc`, which likely contains information
 * such as the user's ID, balance, currency code, and other wallet details.
 * @param currencyCode The `currencyCode` parameter in the `exchangeFiat` function represents the code
 * of the currency being exchanged, such as USD for US Dollar, EUR for Euro, or GBP for British Pound.
 * It is a string value that identifies the specific currency involved in the exchange transaction.
 * @param amount The `amount` parameter in the `exchangeFiat` function represents the quantity of
 * currency that is being exchanged. It is a numeric value that indicates the amount of currency being
 * sent or received in the exchange transaction.
 * @param mode The `mode` parameter in the `exchangeFiat` function determines whether the user is
 * sending or receiving fiat currency. It can have two possible values:
 *
 * @return The function `exchangeFiat` is returning a `NewFiatExchange` object.
 */
export const exchangeFiat = async (userWallet, currencyCode, amount, mode) => {
    const user = await getUserById(userWallet.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const coinCode = currencyCode; // change FiatCurrencyCodes
    const exchangeWallet = await getExchangeFiatWallet(coinCode);
    if (!exchangeWallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Exchange Wallet not found');
    }
    if (amount <= 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid amount, amount should be > 0');
    }
    if (userWallet.balance < amount && mode === 'SEND') {
        throw new ApiError(httpStatus.PAYMENT_REQUIRED, 'Insufficient balance');
    }
    let newFiatTransaction;
    const ref = `F-${new Date().getFullYear()}-${generateReference(16)}`;
    switch (mode) {
        case 'SEND':
            userWallet.balance -= amount;
            await userWallet.save();
            exchangeWallet.balance += amount;
            await exchangeWallet.save();
            newFiatTransaction = {
                userId: new mongoose.Types.ObjectId(1234567),
                walletId: new mongoose.Types.ObjectId(123456789),
                type: transactionTypes.fiatTransfer,
                ref,
                swap: true,
                paymentProvider: 'FIAT',
                narration: 'transfer to admin',
                status: 'SUCCESS',
                fee: 0,
                currencyCode: userWallet.currencyCode,
                providerTransactionId: '',
                adminRef: generateAlphanumericReference(15, GeneratekeyE.alphanum, GeneratePrefixType.TRANSFER),
                cryptoRef: '',
                date: new Date(),
                amount,
            };
            break;
        case 'RECEIVE':
            exchangeWallet.balance -= amount;
            await exchangeWallet.save();
            userWallet.balance += amount;
            await userWallet.save();
            newFiatTransaction = {
                userId: new mongoose.Types.ObjectId(1234567),
                walletId: new mongoose.Types.ObjectId(123456789),
                type: transactionTypes.fiatTransfer,
                ref,
                swap: true,
                paymentProvider: 'FIAT',
                narration: 'transfer from admin',
                status: 'SUCCESS',
                fee: 0,
                currencyCode: userWallet.currencyCode,
                providerTransactionId: '',
                adminRef: generateAlphanumericReference(15, GeneratekeyE.alphanum, GeneratePrefixType.TRANSFER),
                cryptoRef: '',
                date: new Date(),
                amount,
            };
            break;
    }
    // TODO: return isComplete: false if the transaction failed
    const fiatTx = {
        userWallet,
        currencyCode,
        amount,
        isComplete: true,
        description: `transfer from user to admin${generateAlphanumericReference(15, GeneratekeyE.alphanum, GeneratePrefixType.TRANSFER)}`,
        ref,
        status: 'SUCCESS',
        uid: generateUUID(),
    };
    // add transaction
    await addNewFiatPaymentTransaction(newFiatTransaction);
    return fiatTx;
};
//
// add the request to the db and use schedulers to process them later - same for deposits
// but for that to work we have to have our own crypto wallet system
// Withdrawals for fiats and cryptos
// deposits for fiats and cryptos
// CRUD for fiat FIAT_WALLETS
//
// const userBalance = await getSubAccountBalanceByUserId(userWallet.id);
// const userBalance = await getFiatWalletByUserIdAndCurrencyCode(userWallet.id, currencyCode);
// import { TransferResponseType } from '../../flutterwave/interfaces/interface.transfers.flutterwave';
// import { FiatCurrencyCodes } from '../../config/currencies';
// import { IFiatWalletDoc } from '../../wallet/interfaces/interfaces.fiat.wallet';
// import { getSubAccountBalanceByUserId, getVirtualAccountByUserId } from '../../subVirtualAccount/service.virtual';
// import { getUserById } from '../../user/service.user';
// import { getFiatWalletByUserIdAndCurrencyCode } from '../../wallet/services/service.fiat.wallet';
// requestPayload = {
//   user,
//   amount,
//   bankCode: '<flw admin bank code>',
//   accountNumber: '<flw admin account number>',
//   accountName: '<flw admin account name>',
//   narration: `${mode}-${transactionTypes.fiatTransfer}`,
// };
// fiatTx = await createTransferService(requestPayload);
// requestPayload = {
//   user,
//   amount,
//   bankCode: userVirtualAccount.bankCode,
//   accountNumber: userVirtualAccount.accountNumber,
//   accountName: userVirtualAccount.accountName,
//   narration: `${mode}-${transactionTypes.fiatTransfer}`,
// };
// fiatTx = await adminTransferToUser(requestPayload);
// const userVirtualAccount = await getVirtualAccountByUserId(userWallet.userId);
// if (!userVirtualAccount) {
//   throw new ApiError(httpStatus.NOT_FOUND, 'User Virtual Account not found');
// }
// let requestPayload: ITransferCreateServicePayload;
// let fiatTx: TransferResponseType;
//   if (!fiatTx) {
// throw new ApiError(httpStatus.FAILED_DEPENDENCY, `Error occurred in fiat exchange: ${mode} ${coinCode}`);
// }
//# sourceMappingURL=service.fiat.wallet.js.map