"use strict";
exports.__esModule = true;
exports.createWebhook = void 0;
/* eslint-disable import/prefer-default-export */
var joi_1 = require("joi");
var bvnDataSchema = joi_1["default"].object({
    nin: joi_1["default"].string(),
    email: joi_1["default"].string().email(),
    gender: joi_1["default"].string(),
    surname: joi_1["default"].string(),
    serialNo: joi_1["default"].string().allow(null),
    faceImage: joi_1["default"].string(),
    firstName: joi_1["default"].string(),
    landmarks: joi_1["default"].string().allow(null),
    branchName: joi_1["default"].string().allow(null),
    middleName: joi_1["default"].string(),
    nameOnCard: joi_1["default"].string().allow(null),
    dateOfBirth: joi_1["default"].string(),
    lgaOfOrigin: joi_1["default"].string(),
    watchlisted: joi_1["default"].string(),
    lgaOfCapture: joi_1["default"].string().allow(null),
    phoneNumber1: joi_1["default"].string(),
    phoneNumber2: joi_1["default"].string().allow(null),
    maritalStatus: joi_1["default"].string(),
    stateOfOrigin: joi_1["default"].string(),
    enrollBankCode: joi_1["default"].string().allow(null),
    enrollUserName: joi_1["default"].string(),
    enrollmentDate: joi_1["default"].string().allow(null),
    lgaOfResidence: joi_1["default"].string(),
    stateOfCapture: joi_1["default"].string(),
    additionalInfo1: joi_1["default"].string().allow(null),
    productReference: joi_1["default"].string(),
    stateOfResidence: joi_1["default"].string()
});
// Transfer Event
var transferEventTypeSchema = joi_1["default"].object({
    id: joi_1["default"].number().integer(),
    account_number: joi_1["default"].string(),
    bank_name: joi_1["default"].string(),
    bank_code: joi_1["default"].string(),
    fullname: joi_1["default"].string(),
    created_at: joi_1["default"].string().isoDate(),
    currency: joi_1["default"].string(),
    debit_currency: joi_1["default"].string(),
    amount: joi_1["default"].number(),
    fee: joi_1["default"].number(),
    status: joi_1["default"].string().valid('FAILED', 'SUCCESSFUL'),
    reference: joi_1["default"].string(),
    meta: joi_1["default"].any().allow(null),
    narration: joi_1["default"].string(),
    approver: joi_1["default"].string().allow(null),
    complete_message: joi_1["default"].string(),
    requires_approval: joi_1["default"].number().valid(0, 1),
    is_approved: joi_1["default"].number().valid(0, 1)
});
var bvnDetailsSchema = joi_1["default"].object({
    first_name: joi_1["default"].string(),
    last_name: joi_1["default"].string(),
    status: joi_1["default"].string(),
    reference: joi_1["default"].string(),
    callback_url: joi_1["default"].string().allow(null),
    bvn_data: bvnDataSchema.required(),
    created_at: joi_1["default"].string(),
    id: joi_1["default"].number().integer(),
    AccountId: joi_1["default"].number().integer()
});
var webhookEventSchema = joi_1["default"].object({
    event: joi_1["default"].string().required(),
    'event.type': joi_1["default"].string().valid('Transfer', 'BVN').required(),
    data: joi_1["default"].alternatives()["try"](bvnDetailsSchema, transferEventTypeSchema).required()
});
exports.createWebhook = {
    body: webhookEventSchema
};
