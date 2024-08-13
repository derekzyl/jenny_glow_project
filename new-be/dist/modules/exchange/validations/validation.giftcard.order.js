// validations/giftCardOrderValidation.ts
import Joi from 'joi';
import { objectId } from '../../validate/validation.custom';
const giftCardOrderBody = {
    giftCardId: Joi.string().custom(objectId).required(),
    cardPin: Joi.string().required(),
};
export const createGiftCardOrder = {
    body: Joi.object().keys(giftCardOrderBody),
};
export const getGiftCardOrders = {
    query: Joi.object().keys({
        userId: Joi.string().custom(objectId),
        giftCardId: Joi.string().custom(objectId),
        cardPin: Joi.string(),
        orderStatus: Joi.string(),
        ref: Joi.string(),
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getGiftCardOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().custom(objectId),
    }),
};
const giftCardOrder = {
    giftCardId: Joi.string().custom(objectId),
    cardPin: Joi.string(),
    orderStatus: Joi.string(),
    amountInUSD: Joi.number(),
    creditAmount: Joi.number(),
    filled: Joi.boolean(),
    handledBy: Joi.string().custom(objectId),
    isBeingHandled: Joi.boolean(),
    notes: Joi.string(),
};
export const updateGiftCardOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys(giftCardOrder).min(1),
};
export const deleteGiftCardOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().custom(objectId),
    }),
};
export const updateGiftCardOrderByUser = {
    params: Joi.object().keys({
        orderId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        cardPin: Joi.string().required(),
        giftCardId: Joi.string().custom(objectId).required(),
    }),
};
export const creditGiftCardOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        amount: Joi.number().required(),
    }),
};
//# sourceMappingURL=validation.giftcard.order.js.map