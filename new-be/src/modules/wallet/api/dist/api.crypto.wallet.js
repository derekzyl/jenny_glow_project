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
exports.__esModule = true;
exports.simpleSendCryptoAPI = void 0;
var bitpwr_1 = require("@modules/bitpwr");
var config_1 = require("../../../config/config");
// const seed =
//   '14109019bf61f2b9290934469986b23dc8ea94a90b74dbcaa68ec5a03103c549fe5737ac803cf4a4e22564e387b03ee35b67d84f99c46f739504abb502782302';
// const cryptoPayments = new CryptoPayments(seed);
var bpwr = new bitpwr_1["default"](String(config_1["default"].bitpwr.key), String(config_1["default"].bitpwr.secret));
// logger.info(cryptoPayments.getPublicConfig());
// // each exchange would also get payport too (optional)
// //! deprecated
// /**
//  * Create a customer's coin payport
//  * @param {ResolveablePayport} payPortId
//  * @param {SupportedCoinPaymentsSymbol} coinCode
//  * @returns {Promise<WalletResultAPI>}
//  * @deprecated use  createUserSubAccount() instead
//  */
// export const createDepositAddressAPI = async (
//   _payPortId: number,
//   _coinCode: SupportedCoinPaymentsSymbol
// ): Promise<WalletResultAPI | null> => {
//   // if (cryptoPayments.coinCode !== coinCode) {
//   //   if (!(await cryptoPayments.changeNetwork(coinCode))) {
//   //     throw new Error('error changing payments network');
//   //   }
//   // }
//   const { address, extraId } = { address: '', extraId: '' };
//   if (address.length !== 0) {
//     const wallet: WalletResultAPI = {
//       address,
//       extraId: !extraId || extraId === undefined ? '' : extraId,
//     };
//     return wallet;
//   }
//   return null;
// };
// //! deprecated
// /**
//  * Get wallet balance
//  * @param {ResolveablePayport} payPortId
//  * @param {SupportedCoinPaymentsSymbol} coinCode
//  * @returns {Promise<BalanceResultAPI>}
//  * @deprecated use getWalletAddressAccountBalance() instead
//  */
// export const getCoinBalanceAPI = async (
//   payPortId: ResolveablePayport,
//   coinCode: SupportedCoinPaymentsSymbol
// ): Promise<BalanceResultAPI> => {
//   try {
//     if (cryptoPayments.coinCode !== coinCode) {
//       if (!(await cryptoPayments.changeNetwork(coinCode))) {
//         throw new Error('error changing payments network');
//       }
//     }
//     const { confirmedBalance, unconfirmedBalance, spendableBalance } = await cryptoPayments.getBalance(payPortId);
//     const response: BalanceResultAPI = {
//       confirmedBalance,
//       unconfirmedBalance,
//       spendableBalance,
//     };
//     return response;
//   } catch (error) {
//     logger.error(`Error while fetching wallet balance: ${error}`);
//     throw new Error(`Error while fetching wallet balance: ${error}`);
//   }
// };
// check each payport for a confirmed balance
// after transaction has been confirmed init a sendSweepTransaction() to one of paypaddy's payport (liquidity pools) => [12345, 039994885]
// /**
//  * Check if Transaction is confirmed
//  * @param {string} txHash
//  * @param {SupportedCoinPaymentsSymbol} coinCode
//  * @returns {Promise<Boolean | null>}
//  */
// export const isTransactionConfirmedAPI = async (txHash: string, coinCode: SupportedCoinPaymentsSymbol): Promise<Boolean> => {
//   if (cryptoPayments.coinCode !== coinCode) {
//     if (!(await cryptoPayments.changeNetwork(coinCode))) {
//       throw new Error('error changing payments network');
//     }
//   }
//   const isConfirmed = await cryptoPayments.transactionIsConfirmed(txHash);
//   return isConfirmed;
// }; // TODO: add to scheduler, do the checking after every 5-10 mins | also getTransactionDetailsAPI()
// we would only check pending transactions
/**
 * Get Transaction details
 * @param {string} txHash
 * @param {SupportedCoinPaymentsSymbol} coinCode
 * @returns {Promise<Boolean | null>}
 */
// export const getTransactionDetailsAPI = async (
//   txHash: string,
//   coinCode: SupportedCoinPaymentsSymbol
// ): Promise<TransactionDetailsResultAPI> => {
//   if (cryptoPayments.coinCode !== coinCode) {
//     if (!(await cryptoPayments.changeNetwork(coinCode))) {
//       throw new Error('error changing payments network');
//     }
//   }
//   const txInfo = await cryptoPayments.transactionDetails(txHash);
//   const response: TransactionDetailsResultAPI = {
//     id: txInfo.id,
//     confirmations: txInfo.confirmations,
//     isConfirmed: txInfo.isConfirmed,
//     fee: txInfo.fee,
//     amount: txInfo.amount,
//     status: txInfo.status,
//     // add more
//   };
//   return response;
// };
/**
 * The function `simpleSendCryptoAPI` is an asynchronous function that sends a cryptocurrency
 * transaction using the Bitpwr API.
 *
 * @param coinCode The `coinCode` parameter is the symbol or code of the cryptocurrency you want to
 * send. It should be one of the supported coin symbols for the CoinPayments API.
 * @param payload The payload parameter is an object that contains the following properties:
 *
 * @return a Promise that resolves to a TransferCryptoBitpwrResponseI object.
 */
exports.simpleSendCryptoAPI = function (payload) { return __awaiter(void 0, void 0, Promise, function () {
    var res, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, bpwr.TransferBitpwr.makeTransferBitpwr({
                        address: payload.toAddress,
                        cryptoAmount: payload.toAmount,
                        assetType: payload.coinCode,
                        walletId: payload.accountId,
                        fromAddress: payload.fromAddress,
                        subAccountId: payload.subAccountId,
                        description: payload.description
                    })];
            case 1:
                res = _a.sent();
                //! retired this one but might come for it later
                //    const { id } = await cryptoPayments.sendSimpleTransaction(payPortId, toAddress, toAmount);
                // const txInfo = await cryptoPayments.transactionDetails(id);
                // const response: SendResultAPI = {
                //   id,
                //   confirmations: txInfo.confirmations,
                //   isConfirmed: txInfo.isConfirmed,
                //   status: txInfo.status,
                // };
                // return response;
                return [2 /*return*/, res];
            case 2:
                error_1 = _a.sent();
                throw new Error("error while sending transaction:' " + error_1);
            case 3: return [2 /*return*/];
        }
    });
}); };
