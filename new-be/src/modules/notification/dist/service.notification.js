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
exports.sendNotificationViaEmail = exports.sendNotification = exports.sendNotificationToStaffs = exports.viewNotification = exports.queryNotifications = exports.createNotification = void 0;
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/no-use-before-define */
var Roles_1 = require("@modules/admin/Roles");
var staff_1 = require("@modules/admin/staff");
var errors_1 = require("@modules/errors");
var user_1 = require("@modules/user");
var http_status_1 = require("http-status");
var model_notification_1 = require("./model.notification");
var service_email_1 = require("./service.email");
/**
 * Send a NOTIFICATION
 * @param {string} title
 * @param {string} body
 * @returns {Promise<void>}
 */
exports.createNotification = function (userId, title, body, type) { return __awaiter(void 0, void 0, Promise, function () {
    var msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msg = {
                    userId: userId,
                    title: title,
                    body: body,
                    viewed: false,
                    type: type
                };
                return [4 /*yield*/, model_notification_1["default"].create(msg)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * Fetch user NOTIFICATIONSs
 * @param {string} userId
 * @returns {Promise<INotification>}
 */
exports.queryNotifications = function (userId) { return model_notification_1["default"].find({ userId: userId }); };
/**
 * Send reset password NOTIFICATIONS
 * @param {string} id
 * @returns {Promise<void>}
 */
exports.viewNotification = function (id, userId) { return __awaiter(void 0, void 0, Promise, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, model_notification_1["default"].findOneAndUpdate({ id: id, userId: userId }, { viewed: true })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * The function `sendNotificationToStaffs` sends notifications to staff members based on specified
 * permissions and notification type.
 *
 * @param  The `sendNotificationToStaffs` function is designed to send notifications to staff members
 * based on certain criteria. Here's an explanation of the parameters: if you want to send to all staff add `ALL_STAFFS` in permission
 */
exports.sendNotificationToStaffs = function (_a) {
    var body = _a.body, permissions = _a.permissions, title = _a.title, type = _a.type, _b = _a.nType, nType = _b === void 0 ? 'both' : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var staffsId, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, staff_1.staffService.getAllStaffsUserId()];
                case 1:
                    staffsId = _c.sent();
                    if (!(staffsId && staffsId.length > 0 && staffsId !== null && staffsId !== undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all(staffsId.map(function (staffId) { return __awaiter(void 0, void 0, void 0, function () {
                            var hasPermission;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Roles_1.roleServices.checkStaffPermission(staffId, permissions)];
                                    case 1:
                                        hasPermission = _a.sent();
                                        if (hasPermission) {
                                            exports.sendNotification({ body: body, nType: nType, title: title, type: type, userId: staffId });
                                            // Send notification to staff
                                        }
                                        if (permissions.includes('ALL_STAFFS'))
                                            exports.sendNotification({ body: body, nType: nType, title: title, type: type, userId: staffId });
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
};
/**
 * The function `sendNotification` sends a notification to a user via email, notification, or both,
 * based on the specified parameters.
 *
 * @param  - `userId`: The ID of the user to whom the notification will be sent.
 */
exports.sendNotification = function (_a) {
    var body = _a.body, nType = _a.nType, title = _a.title, type = _a.type, userId = _a.userId;
    return __awaiter(void 0, void 0, void 0, function () {
        var user, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, user_1.userService.getUserById(userId)];
                case 1:
                    user = _c.sent();
                    if (!user) {
                        throw new errors_1.ApiError(http_status_1["default"].NOT_FOUND, 'user not found');
                    }
                    _b = nType;
                    switch (_b) {
                        case 'email': return [3 /*break*/, 2];
                        case 'notification': return [3 /*break*/, 4];
                        case 'both': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 9];
                case 2: return [4 /*yield*/, service_email_1.sendDefaultEmail({ body: body, name: user.firstName, subject: title, to: user.email })];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 4: return [4 /*yield*/, exports.createNotification(userId, title, body, type)];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 6: return [4 /*yield*/, service_email_1.sendDefaultEmail({ body: body, name: user.firstName, subject: title, to: user.email })];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, exports.createNotification(userId, title, body, type)];
                case 8:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
};
exports.sendNotificationViaEmail = function (_a) {
    var body = _a.body, nType = _a.nType, title = _a.title, type = _a.type, userEmail = _a.userEmail;
    return __awaiter(void 0, void 0, void 0, function () {
        var user, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, user_1.userService.getUserByEmail(userEmail)];
                case 1:
                    user = _c.sent();
                    if (!user) {
                        throw new errors_1.ApiError(http_status_1["default"].NOT_FOUND, 'user not found');
                    }
                    _b = nType;
                    switch (_b) {
                        case 'email': return [3 /*break*/, 2];
                        case 'notification': return [3 /*break*/, 4];
                        case 'both': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 9];
                case 2: return [4 /*yield*/, service_email_1.sendDefaultEmail({ body: body, name: user.firstName, subject: title, to: user.email })];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 4: return [4 /*yield*/, exports.createNotification(user.id, title, body, type)];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 6: return [4 /*yield*/, service_email_1.sendDefaultEmail({ body: body, name: user.firstName, subject: title, to: user.email })];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, exports.createNotification(user.id, title, body, type)];
                case 8:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
};
