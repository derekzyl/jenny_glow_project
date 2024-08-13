import Joi from 'joi';
import { objectId } from '../../validate';
const createFxBody = {
    address: Joi.string().required(),
    currencyCode: Joi.string().required(),
    currencyName: Joi.string(),
    network: Joi.string().required(),
};
export const createFx = {
    body: Joi.object().keys(createFxBody),
};
const body = Joi.object().keys({});
export const updateFxByUser = {
    body,
};
export const updateFxById = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
    body,
};
export const getFx = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
};
export const deleteFx = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
};
export const getFxs = {
    query: Joi.object().keys({
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        name: Joi.string(),
    }),
};
//# sourceMappingURL=validation.fx.js.map