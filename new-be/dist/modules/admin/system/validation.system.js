import { objectId } from '../../validate';
import Joi from 'joi';
const createSystemBody = {
    canRegisterOnAdminPanel: Joi.boolean(),
    frontendLogo: Joi.string(),
    frontendUrl: Joi.string(),
    sendSms: Joi.boolean(),
};
export const createSystem = {
    body: Joi.object().keys(createSystemBody),
};
export const updateSystem = {
    body: Joi.object().keys(createSystemBody),
    params: Joi.object().keys({ id: Joi.custom(objectId).required() }),
};
export const getSystem = {
    params: Joi.object().keys({ id: Joi.custom(objectId).required() }),
};
export const deleteSystem = {
    params: Joi.object().keys({ id: Joi.custom(objectId).required() }),
};
//# sourceMappingURL=validation.system.js.map