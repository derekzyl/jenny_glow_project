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
exports.checkIfUserHasPinCreated = exports.resetPin = exports.forgotPin = exports.deleteUserPin = exports.changeUserPin = exports.createUserPin = exports.changeUserPassword = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
var ApiError_1 = require("@modules/errors/ApiError");
var notification_1 = require("@modules/notification");
var service_notification_1 = require("@modules/notification/service.notification");
var token_1 = require("@modules/token");
var catchAsync_1 = require("@modules/utils/catchAsync");
var pick_1 = require("@modules/utils/pick");
var http_status_1 = require("http-status");
var mongoose_1 = require("mongoose");
var userService = require("./service.user");
exports.createUser = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userService.createUser(req.body)];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, token_1.tokenService.generateVerifyEmailToken(user)];
            case 2:
                token = _a.sent();
                return [4 /*yield*/, notification_1.emailService.sendVerificationEmail(user.email, token, user.firstName)];
            case 3:
                _a.sent();
                res.status(http_status_1["default"].CREATED).send(user);
                return [2 /*return*/];
        }
    });
}); });
// admin access only
exports.getUsers = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filter, options, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filter = pick_1["default"](req.query, ['firstName', 'lastName', 'role', 'email']);
                options = pick_1["default"](req.query, ['sort', 'limit', 'page', 'projectBy']);
                return [4 /*yield*/, userService.queryUsers(filter, options)];
            case 1:
                result = _a.sent();
                res.send(result);
                return [2 /*return*/];
        }
    });
}); });
// admin access only
exports.getUser = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(typeof req.params['userId'] === 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, userService.getUserById(new mongoose_1["default"].Types.ObjectId(req.params['userId']))];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new ApiError_1["default"](http_status_1["default"].NOT_FOUND, 'User not found');
                }
                res.send(user);
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
exports.updateUser = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(typeof req.params['userId'] === 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, userService.updateUserById(new mongoose_1["default"].Types.ObjectId(req.params['userId']), req.body)];
            case 1:
                user = _a.sent();
                res.send(user);
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
exports.deleteUser = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(typeof req.params['userId'] === 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, userService.deleteUserById(new mongoose_1["default"].Types.ObjectId(req.params['userId']))];
            case 1:
                _a.sent();
                res.status(http_status_1["default"].NO_CONTENT).send();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
exports.changeUserPassword = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userService.changeUserPasswordById(req.user.id, req.body)];
            case 1:
                user = _a.sent();
                res.send(user);
                return [2 /*return*/];
        }
    });
}); });
exports.createUserPin = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, pin, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                pin = req.body.pin;
                return [4 /*yield*/, userService.createUserPin({ userId: user.id, pin: pin })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, service_notification_1.sendNotification({
                        body: "Your pin has been created successfully",
                        nType: 'both',
                        title: 'Pin Created',
                        type: 'Pin Created',
                        userId: user.id
                    })];
            case 2:
                _a.sent();
                res.status(http_status_1["default"].CREATED).send(response);
                return [2 /*return*/];
        }
    });
}); });
exports.changeUserPin = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, pin, oldPin, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                _a = req.body, pin = _a.pin, oldPin = _a.oldPin;
                return [4 /*yield*/, userService.changeUserPin({ userId: user.id, pin: pin, oldPin: oldPin })];
            case 1:
                response = _b.sent();
                return [4 /*yield*/, service_notification_1.sendNotification({
                        body: "Your pin has been changed",
                        nType: 'both',
                        title: 'Pin Changed',
                        type: 'Pin Changed',
                        userId: user.id
                    })];
            case 2:
                _b.sent();
                res.status(http_status_1["default"].OK).send(response);
                return [2 /*return*/];
        }
    });
}); });
exports.deleteUserPin = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userService.deleteUserPinByUserId(req.user.id)];
            case 1:
                _a.sent();
                res.status(http_status_1["default"].NO_CONTENT).send();
                return [2 /*return*/];
        }
    });
}); });
exports.forgotPin = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, resetPinToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                return [4 /*yield*/, token_1.tokenService.generateResetPinToken(user)];
            case 1:
                resetPinToken = _a.sent();
                // await emailService.sendResetPinEmail(user.email, resetPinToken, `${user.firstName} ${user.lastName}`);
                return [4 /*yield*/, service_notification_1.sendNotification({
                        body: "to reset your pin use the reset  \n  " + resetPinToken + " ",
                        title: 'Pin Reset',
                        type: 'Pin Reset',
                        nType: 'email',
                        userId: user.id
                    })];
            case 2:
                // await emailService.sendResetPinEmail(user.email, resetPinToken, `${user.firstName} ${user.lastName}`);
                _a.sent();
                res.status(http_status_1["default"].OK).send({ message: 'successfully sent you mail to change your pin' });
                return [2 /*return*/];
        }
    });
}); });
exports.resetPin = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pin, otpCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pin = req.body.pin;
                otpCode = req.query['token'] !== undefined ? req.query['token'].toString() : '';
                return [4 /*yield*/, userService.updateUserPinByUserId(req.user.id, { pin: pin, otpCode: otpCode })];
            case 1:
                _a.sent();
                res.status(http_status_1["default"].NO_CONTENT).send();
                return [2 /*return*/];
        }
    });
}); });
exports.checkIfUserHasPinCreated = catchAsync_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                return [4 /*yield*/, userService.checkIfUserHasCreatedPin(user.id)];
            case 1:
                data = _a.sent();
                res.status(http_status_1["default"].OK).send({ status: data });
                return [2 /*return*/];
        }
    });
}); });
