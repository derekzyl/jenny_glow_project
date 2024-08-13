import Joi from 'joi';
import { objectId } from '../../validate/validation.custom';
const addCurrencyPairBody = {
    baseCurrency: Joi.string().custom(objectId).required(),
    quoteCurrency: Joi.string().custom(objectId).required(),
    rate: Joi.number(),
    inputType: Joi.string().required(),
    isActive: Joi.boolean().required(),
};
export const addCurrencyPair = {
    body: Joi.object().keys(addCurrencyPairBody),
};
export const getAllCurrencyPairs = {
    query: Joi.object().keys({
        baseCurrency: Joi.string().custom(objectId),
        quoteCurrency: Joi.string().custom(objectId),
        rate: Joi.number(),
        isActive: Joi.boolean(),
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getCurrencyPair = {
    params: Joi.object().keys({
        currencyPairId: Joi.string().custom(objectId),
    }),
};
export const updateCurrencyPair = {
    params: Joi.object().keys({
        currencyPairId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
        baseCurrency: Joi.string().custom(objectId),
        quoteCurrency: Joi.string().custom(objectId),
        rate: Joi.number(),
        InputType: Joi.string().required(),
        isActive: Joi.boolean(),
    })
        .min(1),
};
export const deleteCurrencyPair = {
    params: Joi.object().keys({
        currencyPairId: Joi.string().custom(objectId),
    }),
};
export const deactivateCurrencyPair = {
    params: Joi.object().keys({
        currencyPairId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=validation.currency-pair.exchange.js.map