import { objectId } from '../../validate';
import Joi from 'joi';
export const createReferral = {
    body: Joi.object().keys({
        userId: Joi.string().custom(objectId).required(),
        refBy: Joi.string().optional(),
    }),
};
export const getReferral = {
    params: Joi.object().keys({
        referralId: Joi.string().custom(objectId).required(),
    }),
};
export const updateReferral = {
    params: Joi.object().keys({
        referralId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object()
        .keys({
        refBalance: Joi.number().optional(),
        refBy: Joi.string().optional(),
        totalRef: Joi.number().optional(),
    })
        .min(1),
};
export const deleteReferral = {
    params: Joi.object().keys({
        referralId: Joi.string().custom(objectId).required(),
    }),
};
export const refBonusValidation = {
    createRefBonus: {
        body: Joi.object().keys({
            userId: Joi.string().required(),
            bonus: Joi.number().required(),
            referral: Joi.string().required(),
            type: Joi.string().required(),
        }),
    },
    getRefBonus: {
        params: Joi.object().keys({
            userId: Joi.string().required(),
        }),
    },
    getRefBonusById: {
        params: Joi.object().keys({
            refId: Joi.string().required(),
        }),
    },
    deleteRefBonusById: {
        params: Joi.object().keys({
            refId: Joi.string().required(),
        }),
    },
};
export const refTransValidation = {
    createRefTransaction: {
        body: Joi.object().keys({
            userId: Joi.string().required(),
            amount: Joi.number().required(),
            fee: Joi.number().optional().default(0),
            referral: Joi.string().required(),
            status: Joi.string().valid('SUCCESS', 'PENDING', 'FAILED').required(),
            transType: Joi.string().valid('DEPOSIT', 'WITHDRAWAL').required(),
            type: Joi.string().required(),
            reference: Joi.string().optional(),
        }),
    },
    getRefTransaction: {
        params: Joi.object().keys({
            userId: Joi.string().required(),
        }),
    },
    getRefTransactionById: {
        params: Joi.object().keys({
            refId: Joi.string().required(),
        }),
    },
    deleteRefTransactionById: {
        params: Joi.object().keys({
            refId: Joi.string().required(),
        }),
    },
};
export const userRefValidation = {
    addToUserRefs: {
        body: Joi.object().keys({
            userId: Joi.string().required(),
            ref: Joi.string().required(),
        }),
    },
    getUserRefs: {
        params: Joi.object().keys({
            userId: Joi.string().required(),
        }),
    },
    getUserRefById: {
        params: Joi.object().keys({
            refId: Joi.string().required(),
        }),
    },
    deleteUserRefById: {
        params: Joi.object().keys({
            refId: Joi.string().required(),
        }),
    },
    updateUserRefTotalAmount: {
        body: Joi.object().keys({
            userId: Joi.string().required(),
            ref: Joi.string().required(),
            totalAmount: Joi.number().required(),
        }),
    },
};
//# sourceMappingURL=validation.referral.js.map