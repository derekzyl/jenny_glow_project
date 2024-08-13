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
exports.getUserWalletById = exports.getWalletByWalletAddress = exports.exchangeCrypto = exports.withdrawCrypto = exports.deleteCryptoWalletById = exports.updateCryptoWalletById = exports.getExchangeCryptoWallet = exports.getCryptoWalletByUserIdAndCurrencyCode = exports.getCryptoWalletCumulativeBalanceByUserId = exports.getCryptoWalletsByUserId = exports.syncCryptoWalletWithBitPwr = exports.getAllUsersCryptoAccounts = exports.getCryptoWalletByIdAndCurrencyCode = exports.getCryptoWalletById = exports.queryCryptoWallets = exports.createCryptoWallet = exports.getSubAccountByUid = exports.getSubAccount = exports.createCryptoSubAccount = exports.getMainAccount = void 0;
var ApiError_1 = require("@modules/errors/ApiError");
var service_engine_exchange_1 = require("@modules/exchange/services/service.engine.exchange");
var logger_1 = require("@modules/logger");
var service_notification_1 = require("@modules/notification/service.notification");
var service_crypto_transactions_1 = require("@modules/transactions/services/service.crypto.transactions");
var service_user_1 = require("@modules/user/service.user");
var utils_1 = require("@modules/utils");
var referenceGenerator_1 = require("@modules/utils/referenceGenerator");
var http_status_1 = require("http-status");
var mongoose_1 = require("mongoose");
var __1 = require("..");
var config_1 = require("../../../config/config");
var transactions_1 = require("../../../config/transactions");
var api_1 = require("../api");
var api_crypto_wallet_1 = require("../api/api.crypto.wallet");
var model_crypto_wallet_1 = require("../models/model.crypto.wallet");
var model_subaccount_wallet_1 = require("../models/model.subaccount.wallet");
var service_currency_wallet_1 = require("./service.currency.wallet");
function getMainAccount() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.walletBitpwrApi.getAccountBitpwrAdminAccounts({ page: 1 })];
                case 1:
                    response = _a.sent();
                    data = response.data.filter(function (x) {
                        return x.isDeleted === false &&
                            x.isArchived === false &&
                            ((config_1["default"].env !== 'production' && x.mode === 'TEST' && x.network === 'TESTNET') ||
                                (config_1["default"].env === 'production' && x.mode === 'LIVE' && x.network === 'MAINNET'));
                    });
                    account = data[0];
                    if (!account)
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Account not found');
                    return [2 /*return*/, account];
            }
        });
    });
}
exports.getMainAccount = getMainAccount;
function createCryptoSubAccount(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user, subAcct, account, response, subAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service_user_1.getUserById(userId)];
                case 1:
                    user = _a.sent();
                    if (!user)
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'User not found');
                    return [4 /*yield*/, model_subaccount_wallet_1.CRYPTO_SUB_ACCOUNT.findOne({ userId: user.id })];
                case 2:
                    subAcct = _a.sent();
                    if (subAcct)
                        return [2 /*return*/, subAcct];
                    return [4 /*yield*/, getMainAccount()];
                case 3:
                    account = _a.sent();
                    return [4 /*yield*/, api_1.walletBitpwrApi.createUserSubAccount({
                            metaData: { fullName: user.firstName + " " + user.lastName },
                            accountId: account.uid,
                            name: user.firstName + " " + user.lastName,
                            externalId: user.id
                        })];
                case 4:
                    response = _a.sent();
                    if (!response.data)
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Sub account not created');
                    return [4 /*yield*/, model_subaccount_wallet_1.CRYPTO_SUB_ACCOUNT.create({
                            userId: userId,
                            addressesId: [],
                            externalId: response.data.externalId,
                            uid: response.data.uid,
                            isArchived: response.data.isArchived,
                            isDeleted: response.data.isDeleted,
                            mode: response.data.mode,
                            network: response.data.network,
                            organizationId: response.data.organizationId,
                            name: response.data.name
                        })];
                case 5:
                    subAccount = _a.sent();
                    return [2 /*return*/, subAccount];
            }
        });
    });
}
exports.createCryptoSubAccount = createCryptoSubAccount;
/**
 * The function `getSubAccount` retrieves a sub account based on the provided user ID and throws an
 * error if the sub account is not found.
 *
 * @param userId The `userId` parameter is of type `mongoose.Types.ObjectId`. It represents the unique
 * identifier of a user.
 *
 * @return the subAccount object.
 */
function getSubAccount(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var subAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, model_subaccount_wallet_1.CRYPTO_SUB_ACCOUNT.findOne({ userId: userId })];
                case 1:
                    subAccount = _a.sent();
                    if (!subAccount)
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Sub account not found');
                    return [2 /*return*/, subAccount];
            }
        });
    });
}
exports.getSubAccount = getSubAccount;
/**
 * The function `getSubAccountByUid` retrieves a sub account by its UID and throws an error if it is
 * not found.
 *
 * @param uid The `uid` parameter is a string that represents the unique identifier of a sub account.
 *
 * @return the subAccount object.
 */
function getSubAccountByUid(uid) {
    return __awaiter(this, void 0, void 0, function () {
        var subAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, model_subaccount_wallet_1.CRYPTO_SUB_ACCOUNT.findOne({ uid: uid })];
                case 1:
                    subAccount = _a.sent();
                    if (!subAccount)
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Sub account not found');
                    return [2 /*return*/, subAccount];
            }
        });
    });
}
exports.getSubAccountByUid = getSubAccountByUid;
/*
  Cryptocurrency Wallets
*/
/**
 * Create a cryptocurrency wallet
 * @param {NewRegisteredHDWallet} walletPayload
 * @param {boolean} isExchange
 * @returns {Promise<ICryptoHDWalletDoc>}
 */
exports.createCryptoWallet = function (walletPayload, isExchange) {
    if (isExchange === void 0) { isExchange = false; }
    return __awaiter(void 0, void 0, Promise, function () {
        var user, account, subAccount, getAsset, walletResult, getBalance, currencyImage, getImage, walletBody, res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, service_user_1.getUserById(walletPayload.userId)];
                case 1:
                    user = _b.sent();
                    if (!user) {
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'User not found');
                    }
                    return [4 /*yield*/, model_crypto_wallet_1["default"].isExists(walletPayload.userId, walletPayload.currencyCode)];
                case 2:
                    // check if user has an hd wallet before
                    if (_b.sent()) {
                        throw new ApiError_1["default"](http_status_1["default"].CONFLICT, 'Wallet already exists');
                    }
                    return [4 /*yield*/, getMainAccount()];
                case 3:
                    account = _b.sent();
                    return [4 /*yield*/, model_subaccount_wallet_1.CRYPTO_SUB_ACCOUNT.findOne({ USER: walletPayload.userId })];
                case 4:
                    subAccount = _b.sent();
                    if (!!subAccount) return [3 /*break*/, 6];
                    return [4 /*yield*/, createCryptoSubAccount(walletPayload.userId)];
                case 5:
                    subAccount = _b.sent();
                    _b.label = 6;
                case 6: return [4 /*yield*/, service_currency_wallet_1.getAssetByType(walletPayload.currencyCode)];
                case 7:
                    getAsset = _b.sent();
                    if (!getAsset) {
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Asset not found');
                    }
                    return [4 /*yield*/, api_1.walletBitpwrApi.createCryptoWalletAddress({
                            accountId: account.uid,
                            subAccountId: subAccount.uid,
                            label: user.firstName + " " + user.lastName,
                            asset: walletPayload.currencyCode
                        })];
                case 8:
                    walletResult = _b.sent();
                    // for each currency available create a wallet for the user
                    if (!walletResult || walletResult.status !== 'success') {
                        throw new ApiError_1["default"](http_status_1["default"].FAILED_DEPENDENCY, 'Error while creating deposit address');
                    }
                    return [4 /*yield*/, api_1.walletBitpwrApi.getWalletAddressAccountBalance(walletResult.data.uid)];
                case 9:
                    getBalance = _b.sent();
                    if (getBalance.status !== 'success')
                        throw new ApiError_1["default"](http_status_1["default"].FAILED_DEPENDENCY, 'Error while getting account balance');
                    return [4 /*yield*/, __1.walletCurrencyService.tradableAssetsPlusIcons()];
                case 10:
                    currencyImage = _b.sent();
                    getImage = currencyImage === null || currencyImage === void 0 ? void 0 : currencyImage.find(function (e) { return e.symbol && e.symbol.toUpperCase() === walletPayload.currencyCode; });
                    walletBody = {
                        userId: walletPayload.userId,
                        currencyCode: walletResult.data.assetType,
                        image: (_a = getImage === null || getImage === void 0 ? void 0 : getImage.image) !== null && _a !== void 0 ? _a : '',
                        address: walletResult.data.address,
                        addressContractIdentifier: walletResult.data.addressContractIdentifier,
                        addressType: walletResult.data.addressType,
                        balance: getBalance.data.balance,
                        blocked: getBalance.data.blocked,
                        pending: getBalance.data.pending,
                        received: getBalance.data.received,
                        sent: getBalance.data.sent,
                        derivationIndex: walletResult.data.derivationIndex,
                        isChangeAddress: walletResult.data.isChangeAddress,
                        bal: getBalance.data,
                        isContract: walletResult.data.isContract,
                        lastUsedAt: walletResult.data.lastUsedAt,
                        used: walletResult.data.used,
                        addressRef: walletResult.data.addressRef,
                        assetId: walletResult.data.assetId,
                        assetType: walletResult.data.assetType,
                        chain: walletResult.data.chain,
                        deploymentParams: walletResult.data.deploymentParams,
                        label: walletResult.data.label,
                        network: walletResult.data.network,
                        guid: walletResult.data.guid,
                        mode: walletResult.data.mode,
                        organizationId: walletResult.data.organizationId,
                        uid: walletResult.data.uid,
                        isActive: true,
                        isExchange: isExchange
                    };
                    return [4 /*yield*/, model_crypto_wallet_1["default"].create(walletBody)];
                case 11:
                    res = _b.sent();
                    return [2 /*return*/, res];
            }
        });
    });
};
/**
 * Query for crypto wallets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
exports.queryCryptoWallets = function (filter, options) { return __awaiter(void 0, void 0, Promise, function () {
    var wallets, rsult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model_crypto_wallet_1["default"].paginate(filter, options)];
            case 1:
                wallets = _a.sent();
                rsult = [];
                rsult = wallets.results;
                Promise.all(wallets.results.map(function (e) { return __awaiter(void 0, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, syncCryptoWalletWithBitPwr(e.id)];
                            case 1:
                                data = _a.sent();
                                rsult.push(data);
                                return [2 /*return*/];
                        }
                    });
                }); }));
                return [2 /*return*/, __assign(__assign({}, wallets), { results: rsult })];
        }
    });
}); };
/**
 * Get wallet by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICryptoHDWalletDoc | null>}
 */
exports.getCryptoWalletById = function (id) { return __awaiter(void 0, void 0, Promise, function () {
    var wallet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model_crypto_wallet_1["default"].findById(id)];
            case 1:
                wallet = _a.sent();
                if (!wallet) return [3 /*break*/, 3];
                return [4 /*yield*/, syncCryptoWalletWithBitPwr(wallet.id)];
            case 2:
                wallet = _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, wallet];
        }
    });
}); };
/**
 * Get wallet by id and currency code
 * @param {mongoose.Types.ObjectId} id
 * @param {SupportedCoinPaymentsSymbol} currencyCode
 * @returns {Promise<ICryptoHDWalletDoc | null>}
 */
exports.getCryptoWalletByIdAndCurrencyCode = function (id, currencyCode) { return __awaiter(void 0, void 0, Promise, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model_crypto_wallet_1["default"].findById(id).findOne({ currencyCode: currencyCode })];
            case 1:
                data = _a.sent();
                if (!data) return [3 /*break*/, 3];
                return [4 /*yield*/, syncCryptoWalletWithBitPwr(data.id)];
            case 2:
                data = _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, data];
        }
    });
}); };
function getAllUsersCryptoAccounts(userId) {
    return __awaiter(this, void 0, Promise, function () {
        var wallets, tot;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, model_crypto_wallet_1["default"].find({ userId: userId })];
                case 1:
                    wallets = _a.sent();
                    if (!wallets)
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                    tot = [];
                    if (!wallets) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all(wallets.map(function (e) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = tot).push;
                                    return [4 /*yield*/, syncCryptoWalletWithBitPwr(e.id)];
                                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                            }
                        }); }); }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, tot];
                case 3: return [2 /*return*/, tot];
            }
        });
    });
}
exports.getAllUsersCryptoAccounts = getAllUsersCryptoAccounts;
function syncCryptoWalletWithBitPwr(id) {
    return __awaiter(this, void 0, void 0, function () {
        var wallet, getBalance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, model_crypto_wallet_1["default"].findById(id)];
                case 1:
                    wallet = _a.sent();
                    if (!wallet)
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                    return [4 /*yield*/, api_1.walletBitpwrApi.getWalletAddressAccountBalance(wallet.uid)];
                case 2:
                    getBalance = _a.sent();
                    if (getBalance.status !== 'success')
                        throw new ApiError_1["default"](http_status_1["default"].FAILED_DEPENDENCY, 'Error while getting account balance');
                    wallet.balance = getBalance.data.balance;
                    wallet.blocked = getBalance.data.blocked;
                    wallet.pending = getBalance.data.pending;
                    wallet.received = getBalance.data.received;
                    wallet.sent = getBalance.data.sent;
                    return [4 /*yield*/, wallet.save()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, wallet];
            }
        });
    });
}
exports.syncCryptoWalletWithBitPwr = syncCryptoWalletWithBitPwr;
/**
 * Get wallet by user id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ICryptoHDWalletDoc | null>}
 */
exports.getCryptoWalletsByUserId = function (userId) { return __awaiter(void 0, void 0, Promise, function () { return __generator(this, function (_a) {
    return [2 /*return*/, exports.queryCryptoWallets({ userId: userId }, {})];
}); }); };
exports.getCryptoWalletCumulativeBalanceByUserId = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var wallets, totalValueInUsd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAllUsersCryptoAccounts(userId)];
            case 1:
                wallets = _a.sent();
                totalValueInUsd = 0;
                if (!wallets) return [3 /*break*/, 3];
                return [4 /*yield*/, Promise.all(wallets.map(function (wallet) { return __awaiter(void 0, void 0, void 0, function () {
                        var priceInUsdt, balance;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, service_engine_exchange_1.getExchangeRateInUSDT(wallet.currencyCode)];
                                case 1:
                                    priceInUsdt = _a.sent();
                                    balance = Number(wallet.balance) * Number(priceInUsdt);
                                    totalValueInUsd += balance;
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, totalValueInUsd];
        }
    });
}); };
/**
 * Get wallet by user id and currency code
 * @param {mongoose.Types.ObjectId} userId
 * @param {string} currencyCode
 * @returns {Promise<ICryptoHDWalletDoc | null>}
 */
exports.getCryptoWalletByUserIdAndCurrencyCode = function (userId, currencyCode) { return __awaiter(void 0, void 0, Promise, function () { return __generator(this, function (_a) {
    return [2 /*return*/, model_crypto_wallet_1["default"].findOne({ userId: userId, currencyCode: currencyCode })];
}); }); };
/**
 * The function `getExchangeCryptoWallet` retrieves the address for a given cryptocurrency code, checks
 * if it exists in the database, and creates it if it doesn't.
 *
 * @param currencyCode The `currencyCode` parameter is a string that represents the code of the
 * cryptocurrency for which we want to get the exchange wallet.
 *
 * @return The function `getExchangeCryptoWallet` returns the `address` object.
 */
exports.getExchangeCryptoWallet = function (currencyCode) { return __awaiter(void 0, void 0, void 0, function () {
    var getAssets, getAsset, addresses, address, findInDb, getBalance, currencyImage, getImage, walletBody;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, service_currency_wallet_1.getAllTradableAssets()];
            case 1:
                getAssets = _b.sent();
                getAsset = getAssets.find(function (asset) { return asset.assetType === currencyCode && asset.mode === 'LIVE' && asset.network === 'MAINNET'; });
                if (!getAsset)
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Asset not found');
                return [4 /*yield*/, api_1.walletBitpwrApi.getBitpwrAssetsAddressByAssetId(getAsset.uid)];
            case 2:
                addresses = _b.sent();
                if (addresses.status !== 'success')
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Address not found');
                address = addresses.data.find(function (ad) {
                    return config_1["default"].env === 'development'
                        ? ad.mode === 'TEST' &&
                            ad.network === 'TESTNET' &&
                            ad.derivationIndex === 0 &&
                            ad.isChangeAddress === false &&
                            ad.assetType === currencyCode
                        : ad.derivationIndex === 0 &&
                            ad.isChangeAddress === false &&
                            ad.assetType === currencyCode &&
                            ad.mode === 'LIVE' &&
                            ad.network === 'MAINNET';
                });
                if (!address)
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Address not found');
                return [4 /*yield*/, model_crypto_wallet_1["default"].findOne({ currencyCode: currencyCode, isExchange: true })];
            case 3:
                findInDb = _b.sent();
                return [4 /*yield*/, api_1.walletBitpwrApi.getWalletAddressAccountBalance(address.uid)];
            case 4:
                getBalance = _b.sent();
                if (getBalance.status !== 'success')
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Balance not found');
                return [4 /*yield*/, __1.walletCurrencyService.tradableAssetsPlusIcons()];
            case 5:
                currencyImage = _b.sent();
                getImage = currencyImage === null || currencyImage === void 0 ? void 0 : currencyImage.find(function (e) { return e.symbol && e.symbol.toUpperCase() === currencyCode; });
                if (!!findInDb) return [3 /*break*/, 7];
                walletBody = {
                    userId: new mongoose_1["default"].Types.ObjectId('admin'),
                    currencyCode: address.assetType,
                    image: (_a = getImage === null || getImage === void 0 ? void 0 : getImage.image) !== null && _a !== void 0 ? _a : '',
                    address: address.address,
                    addressContractIdentifier: address.addressContractIdentifier,
                    addressType: address.addressType,
                    balance: getBalance.data.balance,
                    blocked: getBalance.data.blocked,
                    pending: getBalance.data.pending,
                    received: getBalance.data.received,
                    sent: getBalance.data.sent,
                    derivationIndex: address.derivationIndex,
                    isChangeAddress: address.isChangeAddress,
                    bal: getBalance.data,
                    isContract: address.isContract,
                    lastUsedAt: address.lastUsedAt,
                    used: address.used,
                    addressRef: address.addressRef,
                    assetId: address.assetId,
                    assetType: address.assetType,
                    chain: address.chain,
                    deploymentParams: address.deploymentParams,
                    label: address.label,
                    network: address.network,
                    guid: address.guid,
                    mode: address.mode,
                    organizationId: address.organizationId,
                    uid: address.uid,
                    isActive: true,
                    isExchange: true
                };
                return [4 /*yield*/, model_crypto_wallet_1["default"].create(walletBody)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                if (findInDb) {
                    if (findInDb.address !== address.address ||
                        findInDb.addressContractIdentifier !== address.addressContractIdentifier ||
                        findInDb.addressType !== address.addressType) {
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Address not found clarify error');
                    }
                }
                return [2 /*return*/, address];
        }
    });
}); };
/**
 * The function updates a cryptocurrency wallet by its ID and currency code.
 *
 * @param walletId The ID of the crypto wallet that needs to be updated. It is of type
 * `mongoose.Types.ObjectId`.
 * @param currencyCode The `currencyCode` parameter is of type `SupportedCoinPaymentsSymbol`. It
 * represents the code of the cryptocurrency for which the wallet is being updated.
 * @param updateBody The `updateBody` parameter is an object that contains the properties and values
 * that need to be updated in the crypto wallet.
 *
 * @return a Promise that resolves to either an ICryptoHDWalletDoc object or null.
 */
exports.updateCryptoWalletById = function (walletId, currencyCode, updateBody) { return __awaiter(void 0, void 0, Promise, function () {
    var wallet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getCryptoWalletByIdAndCurrencyCode(walletId, currencyCode)];
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
 * The function `deleteCryptoWalletById` deletes a crypto wallet by its ID after checking if it exists
 * and throws an error if it doesn't.
 *
 * @param id The `id` parameter is of type `mongoose.Types.ObjectId`. It represents the unique
 * identifier of the crypto wallet that needs to be deleted.
 *
 * @return a Promise that resolves to either an ICryptoHDWalletDoc object or null.
 */
exports.deleteCryptoWalletById = function (id) { return __awaiter(void 0, void 0, Promise, function () {
    var wallet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getCryptoWalletById(id)];
            case 1:
                wallet = _a.sent();
                if (!wallet) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                }
                // TODO: Before deleting move funds to another wallet
                // await wallet.deleteOne();
                return [2 /*return*/, wallet];
        }
    });
}); };
/**
 * withdraw crypto to address
 * @param {NewCryptoTransactionPayload} transactionPayload
 * @returns {Promise<ICryptoTransactionDoc>}
 */
exports.withdrawCrypto = function (transactionPayload) { return __awaiter(void 0, void 0, Promise, function () {
    var coinCode, wallet, exchange, getAdmin, getSubAcct, getWallet, exchangeWallet, feeAmount, creditAmount, cryptoTx, transactionBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                coinCode = transactionPayload.currencyCode;
                return [4 /*yield*/, exports.getCryptoWalletByUserIdAndCurrencyCode(transactionPayload.userId, coinCode)];
            case 1:
                wallet = _a.sent();
                if (!wallet) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                }
                if (transactionPayload.userId.toString() !== wallet.userId.toString()) {
                    // TODO: use userId to check user roles/permissions
                    throw new ApiError_1["default"](http_status_1["default"].FORBIDDEN, 'Access to Wallet not permitted');
                }
                if (Number(transactionPayload.amount) <= 0) {
                    throw new ApiError_1["default"](http_status_1["default"].BAD_REQUEST, 'Invalid amount, amount should be > 0');
                }
                if (Number(wallet.balance) < Number(transactionPayload.amount)) {
                    throw new ApiError_1["default"](http_status_1["default"].PAYMENT_REQUIRED, 'Insufficient balance');
                }
                return [4 /*yield*/, service_engine_exchange_1.getFirstExchange()];
            case 2:
                exchange = _a.sent();
                if (!exchange) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'error getting exchange rate');
                }
                return [4 /*yield*/, getMainAccount()];
            case 3:
                getAdmin = _a.sent();
                if (!getAdmin) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Admin not found');
                }
                return [4 /*yield*/, getSubAccount(transactionPayload.userId)];
            case 4:
                getSubAcct = _a.sent();
                if (!getSubAcct) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'User not found');
                }
                return [4 /*yield*/, exports.getCryptoWalletByUserIdAndCurrencyCode(transactionPayload.userId, transactionPayload.currencyCode)];
            case 5:
                getWallet = _a.sent();
                if (!getWallet)
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                return [4 /*yield*/, exports.getExchangeCryptoWallet(coinCode)];
            case 6:
                exchangeWallet = _a.sent();
                if (!exchangeWallet) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Exchange Wallet not found');
                }
                feeAmount = (Number(transactionPayload.amount) * Number(exchange.withdrawalFee)) / 100;
                creditAmount = Number(transactionPayload.amount) - feeAmount;
                return [4 /*yield*/, api_crypto_wallet_1.simpleSendCryptoAPI({
                        accountId: getAdmin.uid,
                        toAddress: transactionPayload.toAddress,
                        subAccountId: getSubAcct.uid,
                        toAmount: creditAmount,
                        fromAddress: getWallet.address,
                        coinCode: coinCode
                    })];
            case 7:
                cryptoTx = _a.sent();
                return [4 /*yield*/, api_crypto_wallet_1.simpleSendCryptoAPI({
                        accountId: getAdmin.uid,
                        coinCode: coinCode,
                        toAddress: exchangeWallet.address,
                        fromAddress: getWallet.address,
                        toAmount: feeAmount,
                        description: "transfer from user to admin withdrawal fee" + utils_1.generateAlphanumericReference(15, referenceGenerator_1.GeneratekeyE.alphanum, referenceGenerator_1.GeneratePrefixType.TRANSFER),
                        subAccountId: getSubAcct.uid
                    })];
            case 8:
                _a.sent();
                if (!cryptoTx) {
                    throw new ApiError_1["default"](http_status_1["default"].FAILED_DEPENDENCY, 'Error while sending crypto to address');
                }
                transactionBody = {
                    userId: wallet.userId,
                    walletId: wallet.id,
                    type: transactions_1.transactionTypes.cryptoTransfer,
                    uid: cryptoTx.data.uid,
                    assetType: cryptoTx.data.assetType,
                    chain: cryptoTx.data.chain,
                    fee: cryptoTx.data.fee,
                    description: cryptoTx.data.description,
                    referenceId: "C-" + new Date().getFullYear() + "-" + utils_1.generateReference(16),
                    amount: transactionPayload.amount,
                    fromAddress: wallet.address,
                    network: cryptoTx.data.network,
                    ref: cryptoTx.data.ref,
                    toAddress: transactionPayload.toAddress,
                    status: cryptoTx.data.status
                };
                return [4 /*yield*/, service_notification_1.sendNotification({
                        body: " You are sending \n    " + transactionPayload.amount + " " + transactionPayload.currencyCode + " to " + transactionPayload.toAddress + " \n Transaction ID: " + cryptoTx.data.uid + ", Reference ID: " + transactionBody.referenceId + " \n Status: " + cryptoTx.data.status,
                        nType: 'both',
                        title: ' Crypto Withdrawal',
                        userId: wallet.userId,
                        type: 'crypto withdrawal'
                    })];
            case 9:
                _a.sent();
                return [2 /*return*/, service_crypto_transactions_1.addNewCryptoPaymentTransaction(transactionBody)];
        }
    });
}); };
/**
 * The function `exchangeCrypto` exchanges a specified amount of cryptocurrency between a user's wallet
 * and an exchange wallet.
 *
 * @param userWallet The userWallet parameter is of type ICryptoHDWalletDoc, which represents a
 * document in a database that contains information about a user's cryptocurrency wallet. It likely
 * includes properties such as the user's wallet address, balance, and payment port ID.
 * @param currencyCode The `currencyCode` parameter represents the code of the cryptocurrency that you
 * want to exchange. It should be a string value.
 * @param amount The amount of cryptocurrency to be exchanged. It should be a string representing the
 * numeric value of the amount.
 * @param mode The `mode` parameter is a string that specifies the type of transaction to perform. It
 * can have two possible values: 'SEND' or 'RECEIVE'.
 *
 * @return The function `exchangeCrypto` returns a Promise that resolves to a `SendResultAPI` object.
 */
exports.exchangeCrypto = function (userWallet, currencyCode, amount, mode) { return __awaiter(void 0, void 0, Promise, function () {
    var coinCode, exchangeWallet, getAdmin, getSubAcct, cryptoTx, transactionBody, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                coinCode = currencyCode;
                return [4 /*yield*/, exports.getExchangeCryptoWallet(coinCode)];
            case 1:
                exchangeWallet = _b.sent();
                if (!exchangeWallet) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Exchange Wallet not found');
                }
                return [4 /*yield*/, getMainAccount()];
            case 2:
                getAdmin = _b.sent();
                if (!getAdmin) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Admin not found');
                }
                return [4 /*yield*/, getSubAccount(userWallet.userId)];
            case 3:
                getSubAcct = _b.sent();
                if (!getSubAcct) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'User not found');
                }
                if (Number(amount) <= 0) {
                    throw new ApiError_1["default"](http_status_1["default"].BAD_REQUEST, 'Invalid amount, amount should be > 0');
                }
                if (Number(userWallet.balance) < Number(amount)) {
                    throw new ApiError_1["default"](http_status_1["default"].PAYMENT_REQUIRED, 'Insufficient balance');
                }
                cryptoTx = void 0;
                transactionBody = void 0;
                _a = mode;
                switch (_a) {
                    case 'SEND': return [3 /*break*/, 4];
                    case 'RECEIVE': return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 4: return [4 /*yield*/, api_crypto_wallet_1.simpleSendCryptoAPI({
                    accountId: getAdmin.uid,
                    coinCode: currencyCode,
                    toAddress: exchangeWallet.address,
                    fromAddress: userWallet.address,
                    toAmount: Number(amount),
                    description: "transfer from user to admin" + utils_1.generateAlphanumericReference(15, referenceGenerator_1.GeneratekeyE.alphanum, referenceGenerator_1.GeneratePrefixType.TRANSFER),
                    subAccountId: getSubAcct.uid
                })];
            case 5:
                cryptoTx = _b.sent();
                transactionBody = {
                    userId: userWallet.userId,
                    walletId: userWallet.id,
                    type: transactions_1.transactionTypes.cryptoTransfer,
                    uid: cryptoTx.data.uid,
                    assetType: cryptoTx.data.assetType,
                    chain: cryptoTx.data.chain,
                    fee: cryptoTx.data.fee,
                    description: cryptoTx.data.description,
                    referenceId: "C-" + new Date().getFullYear() + "-" + utils_1.generateReference(16),
                    amount: String(amount),
                    fromAddress: userWallet.address,
                    network: cryptoTx.data.network,
                    ref: cryptoTx.data.ref,
                    toAddress: 'admin',
                    status: cryptoTx.data.status
                };
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, api_crypto_wallet_1.simpleSendCryptoAPI({
                    accountId: getAdmin.uid,
                    coinCode: coinCode,
                    toAddress: userWallet.address,
                    fromAddress: exchangeWallet.address,
                    toAmount: Number(amount),
                    description: "transfer from admin to user  " + utils_1.generateAlphanumericReference(15, referenceGenerator_1.GeneratekeyE.alphanum, referenceGenerator_1.GeneratePrefixType.TRANSFER)
                })];
            case 7:
                cryptoTx = _b.sent();
                transactionBody = {
                    userId: new mongoose_1["default"].Types.ObjectId(123456),
                    walletId: new mongoose_1["default"].Types.ObjectId(exchangeWallet.uid),
                    type: transactions_1.transactionTypes.cryptoTransfer,
                    uid: cryptoTx.data.uid,
                    assetType: cryptoTx.data.assetType,
                    chain: cryptoTx.data.chain,
                    fee: cryptoTx.data.fee,
                    description: cryptoTx.data.description,
                    referenceId: "C-" + new Date().getFullYear() + "-" + utils_1.generateReference(16),
                    amount: String(amount),
                    fromAddress: 'admin',
                    network: cryptoTx.data.network,
                    ref: cryptoTx.data.ref,
                    toAddress: userWallet.address,
                    status: cryptoTx.data.status
                };
                return [3 /*break*/, 8];
            case 8:
                if (!cryptoTx) {
                    throw new ApiError_1["default"](http_status_1["default"].FAILED_DEPENDENCY, "Error occurred in crypto exchange: " + mode + " " + coinCode);
                }
                return [4 /*yield*/, service_notification_1.sendNotification({
                        userId: userWallet.userId,
                        body: " You are " + mode + "ing \n    " + amount + " " + currencyCode + " to " + (mode === 'SEND' ? 'admin' : 'user') + " \n Transaction ID: " + cryptoTx.data.uid + ", Reference ID: " + cryptoTx.data.ref + " \n Status: " + cryptoTx.data.status,
                        nType: 'both',
                        title: " Crypto " + mode,
                        type: "crypto " + mode
                    })];
            case 9:
                _b.sent();
                return [4 /*yield*/, service_crypto_transactions_1.addNewCryptoPaymentTransaction(transactionBody)];
            case 10:
                _b.sent();
                return [2 /*return*/, cryptoTx];
            case 11:
                error_1 = _b.sent();
                logger_1.logger.error(error_1);
                throw new ApiError_1["default"](http_status_1["default"].INTERNAL_SERVER_ERROR, "" + error_1.message);
            case 12: return [2 /*return*/];
        }
    });
}); };
function getWalletByWalletAddress(address) {
    return __awaiter(this, void 0, void 0, function () {
        var wallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, model_crypto_wallet_1["default"].findOne({ address: address })];
                case 1:
                    wallet = _a.sent();
                    if (!wallet)
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                    return [2 /*return*/, wallet];
            }
        });
    });
}
exports.getWalletByWalletAddress = getWalletByWalletAddress;
function getUserWalletById(walletId) {
    return __awaiter(this, void 0, void 0, function () {
        var wallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, model_crypto_wallet_1["default"].findOne({ id: walletId })];
                case 1:
                    wallet = _a.sent();
                    if (!wallet)
                        throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'Wallet not found');
                    return [2 /*return*/, wallet];
            }
        });
    });
}
exports.getUserWalletById = getUserWalletById;
