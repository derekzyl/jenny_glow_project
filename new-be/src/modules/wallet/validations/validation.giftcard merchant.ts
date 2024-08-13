import { objectId } from '@modules/validate/validation.custom';
import Joi from 'joi';
import { GiftCardMerchantI } from '../interfaces/interfaces.giftcard.wallet';

const addGiftCardMerchantBody: Record<keyof Pick<GiftCardMerchantI, 'name' | 'image'>, any> = {
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
