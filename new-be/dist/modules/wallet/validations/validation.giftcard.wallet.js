import Joi from 'joi';
import { objectId } from '../../validate/validation.custom';
const addGiftcardBody = {
    merchant: Joi.string().required().custom(objectId),
    recipient: Joi.string(),
    message: Joi.string(),
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    name: Joi.string().required(),
    rateInUSD: Joi.number(),
    pricePctDiffrence: Joi.number().required(),
    isActive: Joi.boolean().required(),
    refBonus: Joi.number().required(),
};
export const addGiftcard = {
    body: Joi.object().keys(addGiftcardBody),
};
export const getAllGiftcards = {
    query: Joi.object().keys({
        merchant: Joi.string(),
        recipient: Joi.string(),
        name: Joi.string(),
        amount: Joi.number(),
        currencyId: Joi.string().custom(objectId),
        pricePctDiffrence: Joi.number(),
        isActive: Joi.boolean(),
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getGiftcard = {
    params: Joi.object().keys({
        giftcardId: Joi.string().custom(objectId),
    }),
};
export const updateGiftcard = {
    params: Joi.object().keys({
        giftcardId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
        merchant: Joi.string().custom(objectId),
        recipient: Joi.string(),
        message: Joi.string(),
        amount: Joi.number(),
        currency: Joi.string(),
        name: Joi.string(),
        rateInUSD: Joi.number(),
        pricePctDiffrence: Joi.number(),
        isActive: Joi.boolean(),
    })
        .min(1),
};
export const deleteGiftcard = {
    params: Joi.object().keys({
        giftcardId: Joi.string().custom(objectId),
    }),
};
export const deactivateGiftcard = {
    params: Joi.object().keys({
        giftcardId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=validation.giftcard.wallet.js.map