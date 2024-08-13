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
exports.bitpwrWebhookController = exports.createWebhookController = void 0;
var wehook_bitpwr_1 = require("@modules/bitpwr/wehook.bitpwr");
var notification_1 = require("@modules/notification");
var utils_1 = require("@modules/utils");
var _1 = require(".");
exports.createWebhookController = utils_1.catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, headers, b, verify_hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body, headers = req.headers;
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "incoming: " + JSON.stringify(body) + " headers " + JSON.stringify(headers),
                        title: 'webhook failed no hashed header',
                        type: 'error',
                        nType: 'both',
                        permissions: ['ALL_STAFFS']
                    })];
            case 1:
                _a.sent();
                b = body;
                verify_hash = headers['verif-hash'];
                if (!(!verify_hash || Array.isArray(verify_hash) || verify_hash === undefined)) return [3 /*break*/, 3];
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "NO HEADER FOUND: " + JSON.stringify(body) + " headers " + JSON.stringify(headers),
                        title: 'webhook failed no hashed header',
                        type: 'error',
                        nType: 'both',
                        permissions: ['ALL_STAFFS']
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3: return [4 /*yield*/, _1.webhookService(__assign({}, b), verify_hash)];
            case 4:
                _a.sent();
                res.sendStatus(200);
                return [2 /*return*/];
        }
    });
}); });
exports.bitpwrWebhookController = utils_1.catchAsync(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, headers, hashedHeader, isValidHeader, b;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body, headers = req.headers;
                hashedHeader = headers['x-webhook-secret'];
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "NO HEADER FOUND: " + JSON.stringify(body) + " headers " + JSON.stringify(headers),
                        title: 'webhook failed no hashed header',
                        type: 'error',
                        nType: 'both',
                        permissions: ['ALL_STAFFS']
                    })];
            case 1:
                _a.sent();
                if (!(!hashedHeader || Array.isArray(hashedHeader) || hashedHeader === undefined)) return [3 /*break*/, 3];
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "a notification from bitpwr is not found: the data details is  order details is: " + JSON.stringify(body) + " \n headers " + JSON.stringify(headers),
                        title: 'webhook failed no hashed header',
                        type: 'error',
                        nType: 'both',
                        permissions: ['ALL_STAFFS']
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3:
                isValidHeader = wehook_bitpwr_1.isBitPwrWebhookValid(hashedHeader);
                if (!!isValidHeader) return [3 /*break*/, 5];
                return [4 /*yield*/, notification_1.notificationService.sendNotificationToStaffs({
                        body: "a notification " + hashedHeader + " from bitpwr is not found: the data details is order details is: " + JSON.stringify(body),
                        title: 'webhook failed whe invalid header',
                        type: 'error',
                        nType: 'both',
                        permissions: ['ALL_STAFFS']
                    })];
            case 4:
                _a.sent();
                return [2 /*return*/];
            case 5:
                b = body;
                return [4 /*yield*/, wehook_bitpwr_1.handleBitpwrTransactionEvent(b)];
            case 6:
                _a.sent();
                res.sendStatus(200);
                return [2 /*return*/];
        }
    });
}); });
