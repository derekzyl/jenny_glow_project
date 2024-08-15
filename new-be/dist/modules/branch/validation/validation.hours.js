import { joiQuery } from '../../utils/created';
import { objectId } from '../../validate';
import Joi from 'joi';
const workingHoursSchema = {
    day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
    open: Joi.string()
        .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/)
        .required(),
    close: Joi.string()
        .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/)
        .required(), // Assuming 24-hour format
};
export const createWorkingHours = {
    body: Joi.object().keys(Object.assign(Object.assign({}, workingHoursSchema), { branch: Joi.string().required(), createdBy: Joi.string().required() })),
};
export const getOneWorkingHours = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(), // Assuming ObjectId is a string
    }),
};
export const updateWorkingHours = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(), // Assuming ObjectId is a string
    }),
    body: Joi.object().keys(Object.assign(Object.assign({}, workingHoursSchema), { updatedBy: Joi.string().required() })),
};
export const deleteWorkingHours = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(), // Assuming ObjectId is a string
    }),
};
export const getAllWorkingHours = {
    query: Joi.object().keys(Object.assign(Object.assign({}, joiQuery), { day: Joi.string(), branch: Joi.string() })),
};
export const getWorkingHoursByBranch = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(), // Assuming ObjectId is a string
    }),
    query: Joi.object().keys(Object.assign(Object.assign({}, joiQuery), { day: Joi.string() })),
};
//# sourceMappingURL=validation.hours.js.map