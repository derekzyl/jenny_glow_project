import Joi from 'joi';
import { objectId } from '../../validate/validation.custom';
const addGiftCardMerchantBody = {
    name: Joi.string().required(),
    image: Joi.any(),
};
export const addGiftCardMerchant = {
    body: Joi.object().keys(addGiftCardMerchantBody),
};
export const getAllGiftCardMerchants = {
    query: Joi.object().keys({
        name: Joi.string(),
        active: Joi.boolean(),
        sort: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getGiftCardMerchant = {
    params: Joi.object().keys({
        giftCardMerchantId: Joi.string().custom(objectId),
    }),
};
export const updateGiftCardMerchant = {
    params: Joi.object().keys({
        giftCardMerchantId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        image: Joi.string(),
        active: Joi.boolean(),
    }),
};
export const deleteGiftCardMerchant = {
    params: Joi.object().keys({
        giftCardMerchantId: Joi.string().custom(objectId),
    }),
};
export const deactivateGiftCardMerchant = {
    params: Joi.object().keys({
        giftCardMerchantId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=validation.giftcard%20merchant.js.map