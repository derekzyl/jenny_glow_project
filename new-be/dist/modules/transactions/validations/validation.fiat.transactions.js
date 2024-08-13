import Joi from 'joi';
import { objectId } from '../../validate/validation.custom';
export const getFiatTransactions = {
    query: Joi.object().keys({
        referenceId: Joi.string(),
        status: Joi.string(),
        type: Joi.string(),
        walletId: Joi.string().custom(objectId),
        userId: Joi.string().custom(objectId),
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getFiatTransaction = {
    params: Joi.object().keys({
        transactionId: Joi.string().custom(objectId),
    }),
};
export const verifyPaymentTransaction = {
    query: Joi.object().keys({
        tx_ref: Joi.string(),
        transaction_id: Joi.string(),
        status: Joi.string(),
    }),
};
//# sourceMappingURL=validation.fiat.transactions.js.map