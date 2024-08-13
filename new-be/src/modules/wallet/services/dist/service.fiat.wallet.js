"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.exchangeFiat = exports.withdrawalRequest = exports.createDepositRequest = exports.deactivateCurrencyWalletById = exports.deleteCurrencyWalletById = exports.activateCurrencyWalletById = exports.updateFiatWalletById = exports.getFiatWalletById = exports.getExchangeFiatWallet = exports.getFiatWalletByUserIdAndCurrencyCode = exports.getFiatWalletsByUserId = exports.queryCurrencyFiatWallets = exports.createFiatWallet = void 0;
/* eslint-disable import/no-cycle */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
var ApiError_1 = require("@modules/errors/ApiError");
var service_fiat_transactions_1 = require("@modules/transactions/services/service.fiat.transactions");
var service_user_1 = require("@modules/user/service.user");
var utils_1 = require("@modules/utils");
var referenceGenerator_1 = require("@modules/utils/referenceGenerator");
var http_status_1 = require("http-status");
var mongoose_1 = require("mongoose");
var transactions_1 = require("../../../config/transactions");
var currencies_1 = require("../../setting/currencies");
var api_fiat_wallet_1 = require("../api/api.fiat.wallet");
var model_fiat_wallet_1 = require("../models/model.fiat.wallet");
var service_currency_wallet_1 = require("./service.currency.wallet");
/*
  Fiat Currency FIAT_WALLETS
*/
/**
 * Create a fiat wallet
 * @param {NewCreatedFiatWallet} walletBody
 * @returns {Promise<IFiatWalletDoc>}
 */
exports.createFiatWallet = function (walletBody) { return __awaiter(void 0, void 0, Promise, function () {
    var user, currency;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, service_user_1.getUserById(walletBody.userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'User not found');
                }
                return [4 /*yield*/, service_currency_wallet_1.getCurrencyByCode(walletBody.currencyCode)];
            case 2:
                currency = _a.sent();
                if (!currency) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Unsupported currency');
                }
                if (currency.currencyType !== currencies_1.currencyTypes.fiat) {
                    throw new ApiError_1["default"](http_status_1["default"].BAD_REQUEST, 'currencyCode is not a fiat currency');
                }
                return [4 /*yield*/, model_fiat_wallet_1["default"].isExists(walletBody.userId, walletBody.currencyCode)];
            case 3:
                if (_a.sent()) {
                    throw new ApiError_1["default"](http_status_1["default"].CONFLICT, 'Wallet already exists');
                }
                return [2 /*return*/, model_fiat_wallet_1["default"].create(__assign(__assign({}, walletBody), { currencyType: currency.currencyType }))];
        }
    });
}); };
/**
 * Query for fiat wallets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
exports.queryCurrencyFiatWallets = function (filter, options) { return __awaiter(void 0, void 0, Promise, function () {
    var wallets;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model_fiat_wallet_1["default"].paginate(filter, options)];
            case 1:
                wallets = _a.sent();
                return [2 /*return*/, wallets];
        }
    });
}); };
/**
 * Get all wallets that belongs to a user
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IFiatWalletDoc | null>}
 */
exports.getFiatWalletsByUserId = function (userId) { return __awaiter(void 0, void 0, Promise, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, exports.queryCurrencyFiatWallets({ userId: userId }, {})];
    });
}); };
/**
 * Get wallet by user id and currency code
 * @param {mongoose.Types.ObjectId} userId
 * @param {string} currencyCode
 * @returns {Promise<IFiatWalletDoc | null>}
 */
exports.getFiatWalletByUserIdAndCurrencyCode = function (userId, currencyCode) { return __awaiter(void 0, void 0, Promise, function () {
    var v;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model_fiat_wallet_1["default"].findOne({ userId: userId, currencyCode: currencyCode })];
            case 1:
                v = _a.sent();
                return [2 /*return*/, v];
        }
    });
}); };
/**
 * Get exchange wallet
 * @param {string} currencyCode
 * @returns {Promise<IFiatWalletDoc | null>}
 */
exports.getExchangeFiatWallet = function (currencyCode) { return __awaiter(void 0, void 0, Promise, function () { return __generator(this, function (_a) {
    return [2 /*return*/, model_fiat_wallet_1["default"].findOne({ currencyCode: currencyCode, isExchange: true })];
}); }); };
/**
 * Get wallet by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFiatWalletDoc | null>}
 */
exports.getFiatWalletById = function (id) { return __awaiter(void 0, void 0, Promise, function () { return __generator(this, function (_a) {
    return [2 /*return*/, model_fiat_wallet_1["default"].findById(id)];
}); }); };
/**
 * Update user currency wallet by id
 * @param {mongoose.Types.ObjectId} walletId
 * @param {UpdateFiatWalletBody} updateBody
 * @returns {Promise<IFiatWalletDoc | null>}
 */
exports.updateFiatWalletById = function (walletId, updateBody) { return __awaiter(void 0, void 0, Promise, function () {
    var wallet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getFiatWalletById(walletId)];
            case 1:
                wallet = _a.sent();
                if (!wallet) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                }
                Object.assign(wallet, updateBody);
                return [4 /*yield*/, wallet.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, wallet];
        }
    });
}); };
/**
 * activate currency wallet by id
 * @param {mongoose.Types.ObjectId} walletId
 * @returns {Promise<IFiatWalletDoc | null>}
 */
exports.activateCurrencyWalletById = function (walletId) { return __awaiter(void 0, void 0, Promise, function () {
    var updateBody, wallet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updateBody = { isActive: true };
                return [4 /*yield*/, exports.updateFiatWalletById(walletId, updateBody)];
            case 1:
                wallet = _a.sent();
                return [2 /*return*/, wallet];
        }
    });
}); };
/**
 * Delete currency wallet by id
 * @param {mongoose.Types.ObjectId} walletId
 * @returns {Promise<IFiatWalletDoc | null>}
 */
exports.deleteCurrencyWalletById = function (walletId) { return __awaiter(void 0, void 0, Promise, function () {
    var wallet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getFiatWalletById(walletId)];
            case 1:
                wallet = _a.sent();
                if (!wallet) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                }
                // TODO: Before deleting move funds to another wallet
                return [4 /*yield*/, wallet.deleteOne()];
            case 2:
                // TODO: Before deleting move funds to another wallet
                _a.sent();
                return [2 /*return*/, wallet];
        }
    });
}); };
/**
 * Deactivate currency wallet by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {mongoose.Types.ObjectId} walletId
 * @returns {Promise<IFiatWalletDoc | null>}
 */
exports.deactivateCurrencyWalletById = function (userId, walletId) { return __awaiter(void 0, void 0, Promise, function () {
    var wallet, updateBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getFiatWalletById(walletId)];
            case 1:
                wallet = _a.sent();
                if (!wallet) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                }
                if (userId.toString() !== wallet.userId.toString()) {
                    // TODO: use userId to check user roles/permissions
                    throw new ApiError_1["default"](http_status_1["default"].FORBIDDEN, 'Access to Wallet not permitted');
                }
                updateBody = { isActive: false };
                return [4 /*yield*/, exports.updateFiatWalletById(walletId, updateBody)];
            case 2:
                wallet = _a.sent();
                return [2 /*return*/, wallet];
        }
    });
}); };
/*
   DEPOSITS AND WITHDRAWALS
 */
/**
 * wallet deposit by user
 * @param {NewPaymentPayload} paymentPayload
 * @returns {Promise<NewPaymentResponse | null>}
 */
exports.createDepositRequest = function (paymentPayload) { return __awaiter(void 0, void 0, Promise, function () {
    var wallet, transactionBody, fiatTx, paymentRequest, paymentResponse, formattedPaymentResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getFiatWalletById(paymentPayload.walletId)];
            case 1:
                wallet = _a.sent();
                if (!wallet) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                }
                if (paymentPayload.userId.toString() !== wallet.userId.toString()) {
                    throw new ApiError_1["default"](http_status_1["default"].FORBIDDEN, 'Access to Wallet not permitted');
                }
                transactionBody = {
                    userId: wallet.userId,
                    walletId: wallet.id,
                    type: transactions_1.transactionTypes.fiatDeposit,
                    ref: new Date().getFullYear() + "-" + utils_1.generateReference(16),
                    amount: paymentPayload.amount,
                    currencyCode: paymentPayload.currency || 'NGN',
                    narration: paymentPayload.narration || '',
                    providerTransactionId: '',
                    paymentProvider: paymentPayload.provider || currencies_1.paymentProviders.flutterwave
                };
                return [4 /*yield*/, service_fiat_transactions_1.addNewFiatPaymentTransaction(transactionBody)];
            case 2:
                fiatTx = _a.sent();
                paymentRequest = {
                    tx_ref: fiatTx.ref,
                    amount: paymentPayload.amount,
                    currency: paymentPayload.currency,
                    redirect_url: paymentPayload.redirectUrl,
                    customer: paymentPayload.customer
                };
                return [4 /*yield*/, api_fiat_wallet_1.createPaymentAPI(paymentRequest)];
            case 3:
                paymentResponse = _a.sent();
                if (paymentResponse.status !== 'success') {
                    throw new ApiError_1["default"](http_status_1["default"].PAYMENT_REQUIRED, "Error while processing deposit: " + paymentResponse.message);
                }
                formattedPaymentResponse = {
                    paymentLink: paymentResponse.data.link
                };
                return [2 /*return*/, formattedPaymentResponse];
        }
    });
}); };
/**
 * wallet withdrawal by user id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IFiatWalletDoc | null>}
 */
exports.withdrawalRequest = function (userId, walletId, walletCurrencyType) { return __awaiter(void 0, void 0, Promise, function () {
    var user, wallet, currency;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, service_user_1.getUserById(userId)];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'User not found');
                }
                return [4 /*yield*/, exports.getFiatWalletById(walletId)];
            case 2:
                wallet = _a.sent();
                if (!wallet) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                }
                return [4 /*yield*/, service_currency_wallet_1.getCurrencyByCode(wallet.currencyCode)];
            case 3:
                currency = _a.sent();
                if (!currency) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Currency not found');
                }
                if (currency.currencyType !== walletCurrencyType) {
                    //
                }
                // await wallet.deleteOne();
                return [2 /*return*/, wallet];
        }
    });
}); };
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
exports.exchangeFiat = function (userWallet, currencyCode, amount, mode) { return __awaiter(void 0, void 0, Promise, function () {
    var user, coinCode, exchangeWallet, newFiatTransaction, ref, _a, fiatTx;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, service_user_1.getUserById(userWallet.userId)];
            case 1:
                user = _b.sent();
                if (!user) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'User not found');
                }
                coinCode = currencyCode;
                return [4 /*yield*/, exports.getExchangeFiatWallet(coinCode)];
            case 2:
                exchangeWallet = _b.sent();
                if (!exchangeWallet) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Exchange Wallet not found');
                }
                if (amount <= 0) {
                    throw new ApiError_1["default"](http_status_1["default"].BAD_REQUEST, 'Invalid amount, amount should be > 0');
                }
                if (userWallet.balance < amount && mode === 'SEND') {
                    throw new ApiError_1["default"](http_status_1["default"].PAYMENT_REQUIRED, 'Insufficient balance');
                }
                ref = "F-" + new Date().getFullYear() + "-" + utils_1.generateReference(16);
                _a = mode;
                switch (_a) {
                    case 'SEND': return [3 /*break*/, 3];
                    case 'RECEIVE': return [3 /*break*/, 6];
                }
                return [3 /*break*/, 9];
            case 3:
                userWallet.balance -= amount;
                return [4 /*yield*/, userWallet.save()];
            case 4:
                _b.sent();
                exchangeWallet.balance += amount;
                return [4 /*yield*/, exchangeWallet.save()];
            case 5:
                _b.sent();
                newFiatTransaction = {
                    userId: new mongoose_1["default"].Types.ObjectId(1234567),
                    walletId: new mongoose_1["default"].Types.ObjectId(123456789),
                    type: transactions_1.transactionTypes.fiatTransfer,
                    ref: ref,
                    swap: true,
                    paymentProvider: 'FIAT',
                    narration: 'transfer to admin',
                    status: 'SUCCESS',
                    fee: 0,
                    currencyCode: userWallet.currencyCode,
                    providerTransactionId: '',
                    adminRef: utils_1.generateAlphanumericReference(15, referenceGenerator_1.GeneratekeyE.alphanum, referenceGenerator_1.GeneratePrefixType.TRANSFER),
                    cryptoRef: '',
                    date: new Date(),
                    amount: amount
                };
                return [3 /*break*/, 9];
            case 6:
                exchangeWallet.balance -= amount;
                return [4 /*yield*/, exchangeWallet.save()];
            case 7:
                _b.sent();
                userWallet.balance += amount;
                return [4 /*yield*/, userWallet.save()];
            case 8:
                _b.sent();
                newFiatTransaction = {
                    userId: new mongoose_1["default"].Types.ObjectId(1234567),
                    walletId: new mongoose_1["default"].Types.ObjectId(123456789),
                    type: transactions_1.transactionTypes.fiatTransfer,
                    ref: ref,
                    swap: true,
                    paymentProvider: 'FIAT',
                    narration: 'transfer from admin',
                    status: 'SUCCESS',
                    fee: 0,
                    currencyCode: userWallet.currencyCode,
                    providerTransactionId: '',
                    adminRef: utils_1.generateAlphanumericReference(15, referenceGenerator_1.GeneratekeyE.alphanum, referenceGenerator_1.GeneratePrefixType.TRANSFER),
                    cryptoRef: '',
                    date: new Date(),
                    amount: amount
                };
                return [3 /*break*/, 9];
            case 9:
                fiatTx = {
                    userWallet: userWallet,
                    currencyCode: currencyCode,
                    amount: amount,
                    isComplete: true,
                    description: "transfer from user to admin" + utils_1.generateAlphanumericReference(15, referenceGenerator_1.GeneratekeyE.alphanum, referenceGenerator_1.GeneratePrefixType.TRANSFER),
                    ref: ref,
                    status: 'SUCCESS',
                    uid: referenceGenerator_1.generateUUID()
                };
                // add transaction
                return [4 /*yield*/, service_fiat_transactions_1.addNewFiatPaymentTransaction(newFiatTransaction)];
            case 10:
                // add transaction
                _b.sent();
                return [2 /*return*/, fiatTx];
        }
    });
}); };
//
// add the request to the db and use schedulers to process them later - same for deposits
// but for that to work we have to have our own crypto wallet system
// Withdrawals for fiats and cryptos
// deposits for fiats and cryptos
// CRUD for fiat FIAT_WALLETS
//
// const userBalance = await getSubAccountBalanceByUserId(userWallet.id);
// const userBalance = await getFiatWalletByUserIdAndCurrencyCode(userWallet.id, currencyCode);
// import { TransferResponseType } from '@modules/flutterwave/interfaces/interface.transfers.flutterwave';
// import { FiatCurrencyCodes } from '../../config/currencies';
// import { IFiatWalletDoc } from '@modules/wallet/interfaces/interfaces.fiat.wallet';
// import { getSubAccountBalanceByUserId, getVirtualAccountByUserId } from '@modules/subVirtualAccount/service.virtual';
// import { getUserById } from '@modules/user/service.user';
// import { getFiatWalletByUserIdAndCurrencyCode } from '@modules/wallet/services/service.fiat.wallet';
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
