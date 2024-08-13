import Joi from 'joi';
import { objectId } from '../../validate/validation.custom';
const addCurrencyBody = {
    name: Joi.string().required(),
    code: Joi.string().required(),
    symbol: Joi.string().required(),
    currencyType: Joi.string().required(),
    pricePctDifference: Joi.number(),
    label: Joi.string(),
    mode: Joi.string().required(),
    network: Joi.string().required(),
    uid: Joi.string().required(),
    minDeposit: Joi.number(),
    minWithdraw: Joi.number(),
    maxWithdraw: Joi.number(),
    feeType: Joi.string(),
    depositFee: Joi.number(),
    withdrawFee: Joi.number(),
    isActive: Joi.boolean().required(),
    image: Joi.string(),
};
export const addCurrency = {
    body: Joi.object().keys(addCurrencyBody),
};
const addAssetBody = {
    assetType: Joi.string().required(),
    label: Joi.string().required(),
};
export const addAsset = {
    body: Joi.object().keys(addAssetBody),
};
export const getAllCurrencies = {
    query: Joi.object().keys({
        name: Joi.string(),
        currencyType: Joi.string(),
        pricePctDiffrence: Joi.number(),
        minDeposit: Joi.number(),
        minWithdraw: Joi.number(),
        maxWithdraw: Joi.number(),
        feeType: Joi.string(),
        depositFee: Joi.number(),
        withdrawFee: Joi.number(),
        isActive: Joi.boolean(),
        sort: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getCurrency = {
    params: Joi.object().keys({
        currencyId: Joi.string().custom(objectId),
    }),
};
export const getAssetByType = {
    params: Joi.object().keys({
        assetType: Joi.string().required(),
    }),
};
export const updateCurrency = {
    params: Joi.object().keys({
        currencyId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
        name: Joi.string(),
        code: Joi.string(),
        symbol: Joi.string(),
        currencyType: Joi.string(),
        pricePctDiffrence: Joi.number(),
        minDeposit: Joi.number(),
        minWithdraw: Joi.number(),
        maxWithdraw: Joi.number(),
        feeType: Joi.string(),
        depositFee: Joi.number(),
        withdrawFee: Joi.number(),
        isActive: Joi.boolean(),
    })
        .min(1),
};
export const deleteCurrency = {
    params: Joi.object().keys({
        currencyId: Joi.string().custom(objectId),
    }),
};
export const deactivateCurrency = {
    params: Joi.object().keys({
        currencyId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=validation.currency.wallet.js.map