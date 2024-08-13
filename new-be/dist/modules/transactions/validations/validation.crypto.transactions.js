import Joi from 'joi';
import { objectId } from '../../validate/validation.custom';
export const getCryptoTransactions = {
    query: Joi.object().keys({
        fromAddress: Joi.string(),
        toAddress: Joi.string(),
        confirmations: Joi.number().integer(),
        txHash: Joi.string(),
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
export const getCryptoTransaction = {
    params: Joi.object().keys({
        transactionId: Joi.string().custom(objectId),
    }),
};
//# sourceMappingURL=validation.crypto.transactions.js.map