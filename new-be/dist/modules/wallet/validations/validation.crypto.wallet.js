import { objectId } from '../../validate/validation.custom';
import Joi from 'joi';
const withdrawRequestBody = {
    toAddress: Joi.string().required(),
    amount: Joi.string().required(),
    currencyCode: Joi.string(),
};
const createDepositAddressRequestBody = {
    currencyCode: Joi.string().required(),
};
export const createDepositAddressRequest = {
    body: Joi.object().keys(createDepositAddressRequestBody),
};
export const createDepositAddressRequestValidation = {
    body: Joi.object().keys(createDepositAddressRequestBody),
};
export const withdrawRequestValidation = {
    body: Joi.object().keys(withdrawRequestBody),
};
export const createNewWalletValidation = {
    body: Joi.object().keys({
        userId: Joi.string().custom(objectId),
        currencyCode: Joi.string().required(),
    }),
};
export const getCryptoWalletsValidation = {
    query: Joi.object().keys({
        currencyCode: Joi.string(),
        address: Joi.string(),
        userId: Joi.string().custom(objectId),
    }),
};
export const getMainAccountValidation = {
    query: Joi.object().keys({}),
};
export const getWalletByWalletAddressValidation = {
    params: Joi.object().keys({
        address: Joi.string().required(),
    }),
};
export const getCryptoWalletsByUserIdValidation = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};
export const updateCryptoWalletByIdValidation = {
    params: Joi.object().keys({
        walletId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        currencyCode: Joi.string(),
        address: Joi.string(),
    }),
};
export const deleteCryptoWalletByIdValidation = {
    params: Joi.object().keys({
        walletId: Joi.string().custom(objectId),
    }),
};
export const getUserWalletByIdValidation = {
    params: Joi.object().keys({
        walletId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=validation.crypto.wallet.js.map