import { objectId } from '../../../validate';
import Joi from 'joi';
export const cartValidations = {
    createCart: {
        body: Joi.object().keys({
            userId: Joi.string().custom(objectId).required(),
        }),
    },
    getUserCart: {
        params: Joi.object().keys({
            userId: Joi.string().custom(objectId).required(),
        }),
    },
    clearCart: {
        body: Joi.object().keys({
            userId: Joi.string().custom(objectId).required(),
        }),
    },
    addToCartItem: {
        body: Joi.object().keys({
            productId: Joi.string().custom(objectId).required(),
            cartId: Joi.string().custom(objectId).required(),
            variantId: Joi.string().custom(objectId),
        }),
    },
    removeFromCartItem: {
        body: Joi.object().keys({
            productId: Joi.string().custom(objectId).required(),
            cartId: Joi.string().custom(objectId).required(),
            variantId: Joi.string().custom(objectId),
        }),
    },
    getCartItemById: {
        params: Joi.object().keys({
            id: Joi.string().custom(objectId).required(),
        }),
    },
    updateCartItem: {
        params: Joi.object().keys({
            id: Joi.string().custom(objectId).required(),
        }),
        body: Joi.object().keys({
            shippingFee: Joi.number().min(0),
            totalPrice: Joi.number().min(0),
            totalCount: Joi.number().min(1),
        }),
    },
    getCartItemsByCartId: {
        params: Joi.object().keys({
            cartId: Joi.string().custom(objectId).required(),
        }),
    },
    updateCartItemsByAddressChange: {
        params: Joi.object().keys({
            cartId: Joi.string().custom(objectId).required(),
            addressId: Joi.string().custom(objectId).required(),
        }),
    },
    deleteCartItem: {
        params: Joi.object().keys({
            id: Joi.string().custom(objectId).required(),
        }),
    },
    updateCart: {
        params: Joi.object().keys({
            cartId: Joi.string().custom(objectId).required(),
        }),
        body: Joi.object().keys({
            totalPrice: Joi.number().min(0),
            vat: Joi.number().min(0),
            subTotal: Joi.number().min(0),
            totalShippingFee: Joi.number().min(0),
        }),
    },
};
//# sourceMappingURL=validation.cart.js.map