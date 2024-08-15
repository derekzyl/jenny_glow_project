import { objectId } from '../../validate';
import Joi from 'joi';
const createStaffBody = {
    address: Joi.string(),
    benefits: Joi.string(),
    dateOfBirth: Joi.string().isoDate(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    position: Joi.string().required(),
    isAuthenticated: Joi.boolean(),
    isActive: Joi.boolean(),
    salary: Joi.number(),
    hireDate: Joi.string().isoDate(),
    department: Joi.string(),
    email: Joi.string().email(),
    emergencyContactName: Joi.string(),
    emergencyContactPhone: Joi.string(),
    lastActiveTime: Joi.string().isoDate(),
    password: Joi.string(),
    notes: Joi.string(),
    phoneNumber: Joi.string(),
    role: Joi.custom(objectId).required(),
    branchId: Joi.custom(objectId).required(),
};
export const createStaff = {
    body: Joi.object().keys(createStaffBody),
};
const body = Joi.object().keys({
    address: Joi.string(),
    benefits: Joi.string(),
    dateOfBirth: Joi.string().isoDate(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    position: Joi.string(),
    isAuthenticated: Joi.boolean(),
    isActive: Joi.boolean(),
    salary: Joi.number(),
    hireDate: Joi.string().isoDate(),
    department: Joi.string(),
    email: Joi.string().email(),
    emergencyContactName: Joi.string(),
    emergencyContactPhone: Joi.string(),
    lastActiveTime: Joi.string().isoDate(),
    password: Joi.string(),
    notes: Joi.string(),
    phoneNumber: Joi.string(),
    role: Joi.custom(objectId),
});
export const updateStaffByUser = {
    body,
};
export const updateStaffById = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
    body,
};
export const getStaff = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
};
export const deleteStaff = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
};
export const getStaffs = {
    query: Joi.object().keys({
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        name: Joi.string(),
    }),
};
//# sourceMappingURL=validation.staff.js.map