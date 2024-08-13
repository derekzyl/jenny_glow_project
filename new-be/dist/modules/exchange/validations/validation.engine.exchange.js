import Joi from 'joi';
import { objectId } from '../../validate/validation.custom';
const addExchangeBody = {
    volume: Joi.number().required(),
    type: Joi.string().required(),
    isActive: Joi.boolean().required(),
    feeType: Joi.string().required(),
    fee: Joi.number().required(),
    ngnToUsd: Joi.number().required(),
    withdrawalFee: Joi.number().required(),
    isDefault: Joi.boolean().required(),
    localExchangeRateToUsd: Joi.number().required(),
};
export const addExchange = {
    body: Joi.object().keys(addExchangeBody),
};
export const getAllExchanges = {
    query: Joi.object().keys({
        userId: Joi.string().custom(objectId),
        volume: Joi.number(),
        type: Joi.string(),
        isActive: Joi.boolean(),
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getExchange = {
    params: Joi.object().keys({
        exchangeId: Joi.string().custom(objectId),
    }),
};
export const updateExchange = {
    params: Joi.object().keys({
        exchangeId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
        volume: Joi.number(),
        type: Joi.string(),
        isActive: Joi.boolean(),
        feeType: Joi.string(),
        fee: Joi.number(),
        ngnToUsd: Joi.number(),
        withdrawalFee: Joi.number(),
        isDefault: Joi.boolean(),
        localExchangeRateToUsd: Joi.number(),
    })
        .min(1),
};
export const deleteExchange = {
    params: Joi.object().keys({
        exchangeId: Joi.string().custom(objectId),
    }),
};
export const deactivateExchange = {
    params: Joi.object().keys({
        exchangeId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=validation.engine.exchange.js.map