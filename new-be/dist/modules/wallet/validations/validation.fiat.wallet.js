import { objectId } from '../../validate/validation.custom';
import Joi from 'joi';
const createFiatWalletBody = {
    currencyCode: Joi.string().required(),
    isExchange: Joi.boolean(),
};
export const createFiatWallet = {
    body: Joi.object().keys(createFiatWalletBody),
};
export const deactivateFiatWallet = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId),
    }),
};
const createDepositRequestBody = {
    userId: Joi.string().custom(objectId),
    walletId: Joi.string().custom(objectId),
    redirectUrl: Joi.string().required(),
    amount: Joi.number().required(),
    currency: Joi.string(),
    narration: Joi.string(),
    provider: Joi.string(),
    customer: Joi.object()
        .keys({
        email: Joi.string().required(),
        name: Joi.string(),
        phonenumber: Joi.string(),
    })
        .min(1),
};
export const createDepositRequest = {
    body: Joi.object().keys(createDepositRequestBody),
};
export const createFiatWalletValidation = {
    body: Joi.object().keys(createFiatWalletBody),
};
export const createDepositAddressRequestValidation = {
    body: Joi.object().keys({
        userId: Joi.string().custom(objectId),
        currencyCode: Joi.string().required(),
    }),
};
export const getFiatWalletsByUserId = {
    query: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};
export const getFiatWalletByUserIdAndCurrencyCode = {
    params: Joi.object().keys({
        currencyCode: Joi.string().required(),
    }),
};
export const getExchangeFiatWalletValidation = {
    query: Joi.object().keys({
        currencyCode: Joi.string().required(),
    }),
};
export const getFiatWalletByIdValidation = {
    query: Joi.object().keys({
        id: Joi.string().custom(objectId),
    }),
};
export const updateFiatWalletByIdValidation = {
    query: Joi.object().keys({
        id: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        currencyCode: Joi.string(),
        isExchange: Joi.boolean(),
        isActive: Joi.boolean(),
    }),
};
export const activateCurrencyWalletByIdValidation = {
    query: Joi.object().keys({
        id: Joi.string().custom(objectId),
    }),
};
export const deactivateUserFiatWalletValidation = {
    query: Joi.object().keys({
        id: Joi.string().custom(objectId),
    }),
};
export const deleteCurrencyWalletByIdValidation = {
    query: Joi.object().keys({
        id: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=validation.fiat.wallet.js.map