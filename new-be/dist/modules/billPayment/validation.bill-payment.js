import Joi from 'joi';
import { objectId } from '../validate/validation.custom';
const createBillPaymentBody = {
    customer: Joi.string().required().example('the customer phone number code number etc'),
    amount: Joi.number().integer(),
    type: Joi.string().required().valid('AIRTIME', 'DATA_BUNDLE', 'POWER', 'INTERNET', 'TOLL', 'CABLE'),
    billerName: Joi.string().required().example('GLO Nigeria'),
    userTransactionPin: Joi.string().required(),
    useRefBonus: Joi.boolean(),
};
export const createBillPayment = {
    body: Joi.object().keys(createBillPaymentBody),
};
export const getBillPayments = {
    query: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        role: Joi.string(),
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getBillPayment = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId),
    }),
};
export const validateBillPayment = {
    query: Joi.object().keys({
        customer: Joi.string().required(),
        billerCode: Joi.string().required(),
        itemCode: Joi.string().required(),
    }),
};
export const getBillCategories = {
    query: Joi.object().keys({
        airtime: Joi.number().valid(0, 1),
        data_bundle: Joi.number().valid(0, 1),
        cable: Joi.number().valid(0, 1),
        power: Joi.number().valid(0, 1),
        toll: Joi.number().valid(0, 1),
        internet: Joi.number().valid(0, 1),
        biller_code: Joi.string(),
    }),
};
//# sourceMappingURL=validation.bill-payment.js.map