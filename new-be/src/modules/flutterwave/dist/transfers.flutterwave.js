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
var logger_1 = require("@modules/logger");
var interface_flutterwave_1 = require("./interfaces/interface.flutterwave");
var Transfers = /** @class */ (function () {
    /**
     * The constructor function takes a parameter of type Base and assigns it to the instance variable
     * base.
     * @param {Base} base - The "base" parameter is an instance of the "Base" class. It is being passed
     * into the constructor of the current class.
     */
    function Transfers(base) {
        this.base = base;
    }
    /**
     * The function `bulk` sends a bulk transfer request using the provided data and returns the
     * response.
     * @param {BulkTransferSchemaPayload} data - The `data` parameter is of type
     * `BulkTransferSchemaPayload`. It is an object that contains the payload for the bulk transfer
     * request.
     * @returns The response from the API call to `v3/bulk-transfers`.
     */
    Transfers.prototype.bulk = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.base.request("v3/bulk-transfers", data, 'GET')];
                    case 1:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * The `fee` function is an asynchronous function that calculates the transfer fee based on the
     * provided amount and currency.
     * @param data - The `data` parameter is an object that contains the following properties:
     * @returns the response data from the API call.
     */
    Transfers.prototype.fee = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var modData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modData = __assign(__assign({}, data), { excludeQuery: true, method: 'GET' });
                        return [4 /*yield*/, this.base.request("v3/transfers/fee?currency=" + data.currency + "&amount=" + data.amount, modData, 'GET')];
                    case 1:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * The function `initiateTransfer` is an asynchronous function that initiates a transfer using the
     * provided data and returns a promise that resolves to the response of the transfer.
     * @param {TransferSchemaPayload} data - The `data` parameter is an object that contains the
     * necessary information for initiating a transfer. It should have the following properties:
     * @returns a Promise that resolves to a TransferResponseType.
     */
    Transfers.prototype.initiateTransfer = function (data) {
        return __awaiter(this, void 0, Promise, function () {
            var requiredProperties, missingProperties, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!data || typeof data !== 'object' || Array.isArray(data)) {
                            throw new Error('Invalid data parameter');
                        }
                        requiredProperties = ['amount', 'currency', 'account_bank', 'account_number'];
                        missingProperties = requiredProperties.filter(function (prop) { return !(prop in data); });
                        if (missingProperties.length > 0) {
                            throw new Error("Missing required properties: " + missingProperties.join(', '));
                        }
                        return [4 /*yield*/, this.base.request("v3/transfers", data, 'POST')];
                    case 1:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.logger.error(error_1);
                        throw new Error("" + error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * The function fetches transfer data by its ID using a GET request.
     * @param data - The `data` parameter is an object that contains the `id` property. The `id` property
     * is used to specify the ID of the transfer that you want to fetch.
     * @returns The response data from the API call is being returned.
     */
    Transfers.prototype.fetchTransferById = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var modData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modData = __assign(__assign({}, data), { method: 'GET', excludeQuery: true });
                        return [4 /*yield*/, this.base.request("/v3/transfers/" + modData.id, modData, 'GET')];
                    case 1:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * The function `getATransfer` retrieves transfer data based on the provided parameter.
     * @param param - The parameter `param` is of type `Record<string, any>`, which means it can be any
     * object with string keys and any values.
     * @returns The response from the API call is being returned.
     */
    Transfers.prototype.getAllTransfers = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var modParam, response_1, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(param === undefined || param === null)) return [3 /*break*/, 2];
                        modParam = { method: 'GET' };
                        return [4 /*yield*/, this.base.request("/v3/transfers?", modParam, 'GET')];
                    case 1:
                        response_1 = (_a.sent()).data;
                        return [2 /*return*/, response_1];
                    case 2: return [4 /*yield*/, this.base.request("/v3/transfers", __assign({ method: 'GET' }, param), 'GET')];
                    case 3:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * The `getBanks` function retrieves a list of banks based on the specified country code, with a
     * default value of Nigeria.
     * @param {CountryCodesEnum} payload - The `payload` parameter is of type `CountryCodesEnum`, which
     * is an enumeration representing different country codes. In this case, the default value for
     * `payload` is `CountryCodesEnum.Nigeria`.
     * @returns The response from the API call is being returned.
     */
    Transfers.prototype.getBanks = function (payload) {
        if (payload === void 0) { payload = interface_flutterwave_1.CountryCodesEnum.Nigeria; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.base.request("/v3/banks/" + payload, { method: 'GET', excludeQuery: true }, 'GET')];
                    case 1:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Transfers.prototype.getBankBranches = function (bankId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.base.request("/v3/banks/" + bankId + "/branches", { method: 'GET', excludeQuery: true }, 'GET')];
                    case 1:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Transfers.prototype.verifyBankAccount = function (bankDetails) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bankDetails.method = 'POST';
                        return [4 /*yield*/, this.base.request("/v3/accounts/resolve", bankDetails, 'POST')];
                    case 1:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * The function `walletToWallet` transfers funds from one wallet to another, validating the transfer
     * payload and returning the response.
     * @param {WalletTransferPayload} transferPayload - The `transferPayload` parameter is an object that
     * contains the necessary information for transferring funds from one wallet to another. It should
     * have the following properties:
     * @returns a Promise that resolves to a TransferResponseType.
     */
    Transfers.prototype.walletToWallet = function (transferPayload) {
        return __awaiter(this, void 0, void 0, function () {
            var requiredProperties, missingProperties, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!transferPayload || typeof transferPayload !== 'object' || Array.isArray(transferPayload)) {
                            throw new Error('Invalid transferPayload parameter');
                        }
                        requiredProperties = ['amount', 'currency', 'account_bank', 'account_number'];
                        missingProperties = requiredProperties.filter(function (prop) { return !(prop in transferPayload); });
                        if (missingProperties.length > 0) {
                            throw new Error("Missing required properties: " + missingProperties.join(', '));
                        }
                        return [4 /*yield*/, this.base.request("v3/transfers", transferPayload)];
                    case 1:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * The function `retryTransfer` sends a POST request to retry a transfer with the specified ID and
     * returns the response.
     * @param data - The `data` parameter is an object that contains the `id` property.
     * @returns The response from the API call is being returned.
     */
    Transfers.prototype.retryTransfer = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var modData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modData = __assign(__assign({}, data), { method: 'POST' });
                        return [4 /*yield*/, this.base.request("v3/transfers/" + modData.id + "/retries", modData, 'POST')];
                    case 1:
                        response = (_a.sent()).data;
                        return [2 /*return*/, response];
                }
            });
        });
    };
    return Transfers;
}());
/* The line `export default Transfers;` is exporting the `Transfers` class as the default export of the
module. This means that when another module imports this module, they can import the `Transfers`
class directly without having to specify the name of the class in curly braces. For example, in
another module, you can import the `Transfers` class like this: `import Transfers from
'./transfers';`. */
exports["default"] = Transfers;
