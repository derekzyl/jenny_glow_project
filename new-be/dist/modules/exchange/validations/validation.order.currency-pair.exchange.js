import Joi from 'joi';
import { objectId } from '../../validate/validation.custom';
const swapCurrencyOrderBody = {
    amount: Joi.number().required(),
    userTransactionPin: Joi.string().required(),
    baseCurrencyId: Joi.string().custom(objectId).required(),
    quoteCurrencyId: Joi.string().custom(objectId).required(),
};
// change this to currency types
export const swapCurrencyOrder = {
    body: Joi.object().keys(swapCurrencyOrderBody),
};
export const getCurrencyOrderById = {
    query: Joi.object().keys({
        orderId: Joi.string().custom(objectId),
    }),
};
export const updateCurrencyOrder = {
    params: Joi.object().keys({
        orderId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
        exchangeId: Joi.string().custom(objectId),
        currencyId: Joi.string().custom(objectId),
        amount: Joi.number(),
    })
        .min(1),
};
export const deleteCurrencyOrder = {
    params: Joi.object().keys({
        currencyRateId: Joi.string().custom(objectId),
    }),
};
export const getSwapQuote = {
    body: Joi.object().keys({
        amount: Joi.number().required(),
        baseCurrencyCode: Joi.string().required(),
        quoteCurrencyCode: Joi.string().required(),
    }),
};
export const queryCurrencyOrders = {
    query: Joi.object().keys({
        userId: Joi.string().custom(objectId),
        exchangeId: Joi.string().custom(objectId),
        currencyId: Joi.string().custom(objectId),
        sort: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        projectBy: Joi.string(),
    }),
};
export const getCurrencyOrderByRef = {
    params: Joi.object().keys({
        reference: Joi.string().required(),
    }),
};
//# sourceMappingURL=validation.order.currency-pair.exchange.js.map