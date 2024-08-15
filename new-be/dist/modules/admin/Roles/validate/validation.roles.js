import { objectId } from '../../../validate';
import Joi from 'joi';
const createRoleBody = {
    details: Joi.string().required(),
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()).required(),
};
export const createRole = {
    body: Joi.object().keys(createRoleBody),
};
export const assignRole = {
    body: Joi.object().keys({
        roleId: Joi.string().custom(objectId).required(),
        staffEmail: Joi.string().email().required(),
    }),
};
export const getRoles = {
    query: Joi.object().keys({
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        name: Joi.string(),
    }),
};
export const getRoleByName = {
    body: Joi.object().keys({
        name: Joi.string().required(),
    }),
};
export const getRole = {
    params: Joi.object().keys({
        roleId: Joi.string().custom(objectId).required(),
    }),
};
export const updateRole = {
    params: Joi.object().keys({
        roleId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        details: Joi.string(),
        permissions: Joi.array().items(Joi.string()),
    }),
};
export const deleteRole = {
    params: Joi.object().keys({
        roleId: Joi.string().custom(objectId),
    }),
};
export const getRoleFromUserRole = {
    body: Joi.object().keys({
        role: Joi.string().required(),
    }),
};
//# sourceMappingURL=validation.roles.js.map