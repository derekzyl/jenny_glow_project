"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.depositWebHook = exports.transferWebHook = void 0;
/* eslint-disable import/prefer-default-export */
var interface_flutterwave_1 = require("@modules/flutterwave/interfaces/interface.flutterwave");
var logger_1 = require("@modules/logger");
var notification_1 = require("@modules/notification");
var currencies_1 = require("@modules/setting/currencies");
var roles_1 = require("@modules/setting/roles");
var subVirtualAccount_1 = require("@modules/subVirtualAccount");
var model_transfers_1 = require("@modules/tranfers/model.transfers");
var service_transfers_1 = require("@modules/tranfers/service.transfers");
var api_fiat_transactions_1 = require("@modules/transactions/api/api.fiat.transactions");
var service_fiat_transactions_1 = require("@modules/transactions/services/service.fiat.transactions");
var wallet_1 = require("@modules/wallet");
var service_fiat_wallet_1 = require("@modules/wallet/services/service.fiat.wallet");
var transactions_1 = require("../../../config/transactions");
/**
 * The `transferWebHook` function processes incoming transfer data, performs various checks and updates
 * related tables, and sends notifications based on the transfer status.
 *
 * @param data The `data` parameter in the `transferWebHook` function represents the incoming transfer
 * data that is being processed. This data includes information such as the transfer reference,
 * transfer ID, status, amount, currency, recipient details, and other relevant transfer details. The
 * function uses this data to perform various operations
 *
 * @return The function `transferWebHook` returns nothing explicitly. It may return `undefined` if none
 * of the conditions inside the function are met.
 */
exports.transferWebHook = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var findUserByReference, walletId, getTransfer, trn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.logger.info("data: " + JSON.stringify(data));
                return [4 /*yield*/, model_transfers_1["default"].findOne({ reference: data.reference })];
            case 1:
                findUserByReference = _a.sent();
                if (!!findUserByReference) return [3 /*break*/, 3];
                logger_1.logger.error("checked flutterwave: " + data + " ");
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "Transfer with reference " + data.reference + " was not found " + JSON.stringify(data),
                        title: 'Transfer',
                        type: 'TRANSFER',
                        permissions: __spreadArrays(Object.values(roles_1.allPermissions.Transactions))
                    })];
            case 2:
                _a.sent();
                /* throw new ApiError(httpStatus.BAD_REQUEST, 'User not found'); */
                return [2 /*return*/];
            case 3: return [4 /*yield*/, wallet_1.FIAT_WALLETS.findOne({ userId: findUserByReference.userId })];
            case 4:
                walletId = _a.sent();
                if (!!walletId) return [3 /*break*/, 6];
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "Transfer with reference " + data.reference + " was not found: error occurred at finding fiat wallet " + JSON.stringify(data),
                        title: 'Transfer',
                        type: 'TRANSFER',
                        permissions: __spreadArrays(Object.values(roles_1.allPermissions.Transactions))
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [4 /*yield*/, service_transfers_1.getTransferByIdFromFlw(data.id)];
            case 7:
                getTransfer = _a.sent();
                if (!!getTransfer) return [3 /*break*/, 9];
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "Transfer with reference " + data.reference + " the transfer wasn't validated from flutterwave",
                        title: 'Transfer',
                        type: 'TRANSFER',
                        permissions: __spreadArrays(Object.values(roles_1.allPermissions.Transactions))
                    })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                trn = getTransfer.data;
                if (!(String(trn.status).toUpperCase() !== String(data.status).toUpperCase())) return [3 /*break*/, 11];
                logger_1.logger.error("checked flutterwave: " + trn + " webhook " + JSON.stringify(data));
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "checked flutterwave: " + trn + " webhook " + JSON.stringify(data),
                        title: 'Transfer',
                        type: 'TRANSFER',
                        permissions: __spreadArrays(Object.values(roles_1.allPermissions.Transactions))
                    })];
            case 10:
                _a.sent();
                return [2 /*return*/];
            case 11: 
            // update transfer table with reference and status success
            // await TRANSFERS.updateOne({ reference: data.reference }
            return [4 /*yield*/, service_transfers_1.updateTransferServiceWithRef({
                    accountNumber: trn.account_number,
                    amount: trn.amount,
                    debitCurrency: trn.debit_currency,
                    bankCode: trn.bank_code,
                    bankName: trn.bank_name,
                    completeMessage: trn.complete_message,
                    createdAt: new Date(trn.created_at),
                    meta: trn.meta,
                    transferType: 'TRANSFER',
                    narration: trn.narration,
                    requiresApproval: trn.requires_approval,
                    isApproved: trn.is_approved,
                    status: trn.status,
                    fee: trn.fee,
                    currency: trn.currency,
                    fullName: trn.full_name,
                    txId: trn.id
                }, trn.reference)];
            case 12:
                // update transfer table with reference and status success
                // await TRANSFERS.updateOne({ reference: data.reference }
                _a.sent();
                return [4 /*yield*/, service_fiat_transactions_1.addNewFiatPaymentTransaction({
                        amount: trn.amount,
                        date: new Date(trn.created_at),
                        ref: trn.reference,
                        userId: findUserByReference.userId,
                        flwRef: String(trn.id),
                        fee: trn.fee,
                        type: transactions_1.transactionTypes.fiatTransfer,
                        paymentProvider: currencies_1.paymentProviders.flutterwave,
                        fiatTransfer: {
                            recipientAccountNumber: trn.account_number,
                            recipientBankName: trn.bank_name,
                            recipientBankCode: trn.bank_code,
                            recipientFullName: trn.full_name
                        },
                        narration: trn.narration + "  " + trn.complete_message,
                        providerTransactionId: String(trn.id),
                        currencyCode: trn.currency,
                        walletId: walletId === null || walletId === void 0 ? void 0 : walletId._id
                    })];
            case 13:
                _a.sent();
                if (!(trn.status.toUpperCase() === 'SUCCESSFUL')) return [3 /*break*/, 15];
                return [4 /*yield*/, notification_1.notificationService.sendNotification({
                        userId: findUserByReference.userId,
                        body: "Transfer of " + trn.amount + trn.currency + " " + trn.status + " \n\n     narration: " + trn.complete_message,
                        type: 'TRANSFER',
                        title: 'transfers',
                        nType: 'both'
                    })];
            case 14:
                _a.sent();
                return [3 /*break*/, 17];
            case 15: return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                    body: "Transfer of " + JSON.stringify(trn) + " failed for user " + findUserByReference.userId + " check and update their fiat balance ",
                    type: 'TRANSFER',
                    title: 'Transfer Error',
                    nType: 'both',
                    permissions: __spreadArrays(Object.values(roles_1.allPermissions.Transactions))
                })];
            case 16:
                _a.sent();
                _a.label = 17;
            case 17: return [2 /*return*/];
        }
    });
}); };
/**
 * The `depositWebHook` function processes incoming deposits, verifies transactions, updates balances,
 * and creates transfer and payment records.
 *
 * @param data The `depositWebHook` function is designed to handle incoming deposit data. It performs
 * several operations based on the incoming data. Here's a breakdown of the main operations it carries
 * out:
 *
 * @return The function `depositWebHook` returns nothing explicitly. It contains multiple `return;`
 * statements within conditional blocks, but there is no explicit return value specified at the end of
 * the function.
 */
exports.depositWebHook = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var verifyTransaction, PSA, transfer, wallet, addTransfer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.logger.info("data: " + JSON.stringify(data));
                return [4 /*yield*/, api_fiat_transactions_1.verifyTransactionAPI(String(data.id))];
            case 1:
                verifyTransaction = _a.sent();
                if (!(String(verifyTransaction.status).toLowerCase() !== 'success')) return [3 /*break*/, 3];
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "Transfer with reference \n " + JSON.stringify(data) + " \n the transfer wasn't validated from flutterwave",
                        title: 'Transfer',
                        type: 'TRANSFER',
                        permissions: __spreadArrays(Object.values(roles_1.allPermissions.Transactions))
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3: return [4 /*yield*/, subVirtualAccount_1.VIRTUAL_SUB_ACCOUNTS.findOne({ accountReferenceFlw: verifyTransaction.data.tx_ref })];
            case 4:
                PSA = _a.sent();
                if (!!PSA) return [3 /*break*/, 6];
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "Incoming deposit \n " + JSON.stringify(data) + " \n couldnt find virtual sub-account",
                        title: 'DEPOSIT',
                        type: 'DEPOSIT',
                        permissions: __spreadArrays(Object.values(roles_1.allPermissions.Transactions))
                    })];
            case 5:
                _a.sent();
                return [2 /*return*/];
            case 6: return [4 /*yield*/, model_transfers_1["default"].findOne({ reference: verifyTransaction.data.flw_ref, txId: verifyTransaction.data.id })];
            case 7:
                transfer = _a.sent();
                if (!transfer) return [3 /*break*/, 9];
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "this transaction is already settled \n " + JSON.stringify(data) + " \n the transfer wasn't validated from flutterwave",
                        title: 'Transfer',
                        type: 'TRANSFER',
                        permissions: __spreadArrays(Object.values(roles_1.allPermissions.Transactions))
                    })];
            case 8:
                _a.sent();
                return [2 /*return*/];
            case 9: return [4 /*yield*/, wallet_1.FIAT_WALLETS.findOne({ userId: PSA.userId })];
            case 10:
                wallet = _a.sent();
                if (!!wallet) return [3 /*break*/, 12];
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "Incoming deposit \n " + JSON.stringify(verifyTransaction.data) + " \n money came in but no wallet found for user " + PSA.userId + " \n the transfer wasn't validated from flutterwave",
                        title: 'DEPOSIT',
                        type: 'DEPOSIT',
                        permissions: __spreadArrays(Object.values(roles_1.allPermissions.Transactions))
                    })];
            case 11:
                _a.sent();
                return [2 /*return*/];
            case 12: return [4 /*yield*/, service_fiat_wallet_1.exchangeFiat(wallet, interface_flutterwave_1.CurrencyCodesEnum.Nigeria, verifyTransaction.data.amount, 'RECEIVE')];
            case 13:
                _a.sent();
                addTransfer = {
                    userId: PSA.userId,
                    amount: verifyTransaction.data.amount,
                    bankCode: verifyTransaction.data.meta.bankname,
                    bankName: verifyTransaction.data.meta.bankname,
                    completeMessage: "completed",
                    createdAt: new Date(verifyTransaction.data.created_at),
                    meta: verifyTransaction.data.meta,
                    transferType: 'DEPOSIT',
                    narration: verifyTransaction.data.narration,
                    requiresApproval: 0,
                    isApproved: 1,
                    status: verifyTransaction.data.status,
                    fee: verifyTransaction.data.app_fee,
                    currency: verifyTransaction.data.currency,
                    fullName: verifyTransaction.data.meta.originatorname,
                    txId: verifyTransaction.data.id,
                    reference: verifyTransaction.data.flw_ref,
                    merchantName: verifyTransaction.data.meta.bankname,
                    accountNumber: verifyTransaction.data.meta.originatoraccountnumber,
                    debitCurrency: verifyTransaction.data.currency
                };
                return [4 /*yield*/, model_transfers_1["default"].create(addTransfer)];
            case 14:
                _a.sent();
                return [4 /*yield*/, service_fiat_transactions_1.addNewFiatPaymentTransaction({
                        amount: verifyTransaction.data.amount,
                        date: new Date(verifyTransaction.data.created_at),
                        ref: verifyTransaction.data.flw_ref,
                        userId: PSA.userId,
                        fee: verifyTransaction.data.app_fee,
                        paymentProvider: currencies_1.paymentProviders.flutterwave,
                        flwRef: String(verifyTransaction.data.id),
                        type: transactions_1.transactionTypes.fiatDeposit,
                        fiatDeposit: {
                            senderAccountNumber: verifyTransaction.data.meta.originatoraccountnumber,
                            senderBankName: verifyTransaction.data.meta.bankname,
                            senderBankCode: verifyTransaction.data.meta.bankname,
                            senderFullName: verifyTransaction.data.meta.originatorname
                        },
                        narration: verifyTransaction.data.narration,
                        providerTransactionId: String(data.id),
                        currencyCode: interface_flutterwave_1.CurrencyCodesEnum.Nigeria,
                        walletId: wallet._id
                    })];
            case 15:
                _a.sent();
                notification_1.notificationService.sendNotification({
                    userId: PSA.userId,
                    body: "Deposit of " + data.amount + " " + data.currency + " was successful",
                    title: 'deposits',
                    type: 'DEPOSIT',
                    nType: 'both'
                });
                return [2 /*return*/];
        }
    });
}); };
