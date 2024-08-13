import Joi from 'joi';
import { objectId } from '../validate';
export const createVirtual = {
    bvn: Joi.string()
        .required()
        .length(11)
        .pattern(/^[0-9]+$/),
    phoneNumber: Joi.string().required(),
};
export const virtualCreateBody = {
    body: Joi.object().keys(createVirtual),
};
const fetchVirtualAccountById = {
    id: Joi.string().custom(objectId),
};
export const virtualFetchById = {
    params: Joi.object().keys(fetchVirtualAccountById),
};
export const virtualDeleteById = {
    params: Joi.object().keys(fetchVirtualAccountById),
};
export const getVirtualAccountTransactions = {
    query: Joi.object().keys({
        from: Joi.date(),
        to: Joi.date(),
        sort: Joi.string(),
        projectBy: Joi.string(),
        bankName: Joi.string(),
        accountNumber: Joi.string(),
        accountReferenceFlw: Joi.string(),
        accRef: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
export const getAllVirtualSubs = {
    query: Joi.object().keys({
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
//# sourceMappingURL=validate.virtual.js.map