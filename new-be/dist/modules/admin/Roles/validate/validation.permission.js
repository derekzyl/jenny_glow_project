import Joi from 'joi';
const createPermissionBody = {
    details: Joi.string().required(),
    name: Joi.string().required(),
};
export const createPermission = {
    body: Joi.object().keys(createPermissionBody),
};
export const createPermissions = {
    body: Joi.array().items(Joi.object().keys(createPermissionBody)),
};
export const getPermission = {
    params: Joi.object().keys({
        id: Joi.number().required(),
    }),
};
export const updatePermission = {
    params: Joi.object().keys({
        id: Joi.number().required(),
    }),
    body: Joi.object().keys(createPermissionBody),
};
export const deletePermission = {
    params: Joi.object().keys({
        id: Joi.number().required(),
    }),
};
export const getPermissions = {
    query: Joi.object().keys({
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        name: Joi.string(),
    }),
};
//# sourceMappingURL=validation.permission.js.map