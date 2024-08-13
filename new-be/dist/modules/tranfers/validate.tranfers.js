import { objectId } from '../validate/validation.custom';
import Joi from 'joi';
export const createTransferServiceValidation = {
    body: Joi.object().keys({
        amount: Joi.number().required(),
        bankCode: Joi.string().required(),
        accountNumber: Joi.string().required(),
        accountName: Joi.string().required(),
        narration: Joi.string(),
        userTransactionPin: Joi.string().required(),
        useRefBonus: Joi.boolean(),
    }),
};
export const verifyAccountNumberServiceValidation = {
    body: Joi.object().keys({
        bankCode: Joi.string().required(),
        accountNumber: Joi.string().required(),
    }),
};
export const getBanksServiceValidation = {
    params: Joi.object().keys({
        countryId: Joi.string(),
    }),
};
export const getOneBankServiceValidation = {
    params: Joi.object().keys({
        bankCode: Joi.string().required(),
        countryId: Joi.string(),
    }),
};
export const getBankBranchesServiceValidation = {
    params: Joi.object().keys({
        bankId: Joi.string().required(),
    }),
};
export const createBulkTransferServiceValidation = {
    body: Joi.object().keys({
        user: Joi.object().required(),
        bulkData: Joi.array().items({
            accountName: Joi.string().required(),
            accountNumber: Joi.string().required(),
            bankCode: Joi.string().required(),
            amount: Joi.number().required(),
        }),
        title: Joi.string(),
    }),
};
export const getTransferFeeServiceValidation = {
    params: Joi.object().keys({
        amount: Joi.number().required(),
    }),
};
export const getAllTransfersFromFlwValidation = {
    query: Joi.object().keys({
        page: Joi.string(),
        status: Joi.string(),
        from: Joi.string(),
        to: Joi.string(),
    }),
};
export const getTransferByIdFromFlwValidation = {
    params: Joi.object().keys({
        transferId: Joi.number().required(),
    }),
};
export const getTransferByIdServiceValidation = {
    params: Joi.object().keys({
        request: Joi.string().custom(objectId).required(),
    }),
};
export const retryTransferServiceValidation = {
    params: Joi.object().keys({
        transferId: Joi.string().required(),
    }),
};
export const userTransferToAdminServiceValidation = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required(),
        amount: Joi.number().required(),
        transactionType: Joi.string().required(),
        mode: Joi.string().valid('WEBHOOK', 'USER').required(),
        userTransactionPin: Joi.string(),
    }),
};
//# sourceMappingURL=validate.tranfers.js.map