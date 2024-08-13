/* eslint-disable import/prefer-default-export */
import Joi from 'joi';
const bvnDataSchema = Joi.object({
    nin: Joi.string(),
    email: Joi.string().email(),
    gender: Joi.string(),
    surname: Joi.string(),
    serialNo: Joi.string().allow(null),
    faceImage: Joi.string(),
    firstName: Joi.string(),
    landmarks: Joi.string().allow(null),
    branchName: Joi.string().allow(null),
    middleName: Joi.string(),
    nameOnCard: Joi.string().allow(null),
    dateOfBirth: Joi.string(),
    lgaOfOrigin: Joi.string(),
    watchlisted: Joi.string(),
    lgaOfCapture: Joi.string().allow(null),
    phoneNumber1: Joi.string(),
    phoneNumber2: Joi.string().allow(null),
    maritalStatus: Joi.string(),
    stateOfOrigin: Joi.string(),
    enrollBankCode: Joi.string().allow(null),
    enrollUserName: Joi.string(),
    enrollmentDate: Joi.string().allow(null),
    lgaOfResidence: Joi.string(),
    stateOfCapture: Joi.string(),
    additionalInfo1: Joi.string().allow(null),
    productReference: Joi.string(),
    stateOfResidence: Joi.string(),
});
// Transfer Event
const transferEventTypeSchema = Joi.object({
    id: Joi.number().integer(),
    account_number: Joi.string(),
    bank_name: Joi.string(),
    bank_code: Joi.string(),
    fullname: Joi.string(),
    created_at: Joi.string().isoDate(),
    currency: Joi.string(),
    debit_currency: Joi.string(),
    amount: Joi.number(),
    fee: Joi.number(),
    status: Joi.string().valid('FAILED', 'SUCCESSFUL'),
    reference: Joi.string(),
    meta: Joi.any().allow(null),
    narration: Joi.string(),
    approver: Joi.string().allow(null),
    complete_message: Joi.string(),
    requires_approval: Joi.number().valid(0, 1),
    is_approved: Joi.number().valid(0, 1),
});
const bvnDetailsSchema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    status: Joi.string(),
    reference: Joi.string(),
    callback_url: Joi.string().allow(null),
    bvn_data: bvnDataSchema.required(),
    created_at: Joi.string(),
    id: Joi.number().integer(),
    AccountId: Joi.number().integer(),
});
const webhookEventSchema = Joi.object({
    event: Joi.string().required(),
    'event.type': Joi.string().valid('Transfer', 'BVN').required(),
    data: Joi.alternatives().try(bvnDetailsSchema, transferEventTypeSchema).required(),
});
export const createWebhook = {
    body: webhookEventSchema,
};
//# sourceMappingURL=validate.webhook.js.map