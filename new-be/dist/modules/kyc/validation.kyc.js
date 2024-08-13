import Joi from 'joi';
import { objectId } from '../validate/validation.custom';
// Validation schema for creating a KYC user
export const createKycUserBody = {
    phoneNumber: Joi.string(),
    address: Joi.string(),
    country: Joi.string(),
    documentNumber: Joi.string(),
    dateOfBirth: Joi.string(),
    bvn: Joi.string(),
};
export const createKycUser = {
    body: Joi.object().keys(createKycUserBody),
    files: Joi.array()
        .items(Joi.object({
        // Schema for each uploaded file object
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: Joi.number().max(5), // Maximum file size (1 MB)
    }))
        .allow(null),
};
export const getKycUsers = {
    query: Joi.object().keys({
        country: Joi.string(),
        tier: Joi.number().valid(0, 1, 2, 3),
        userId: Joi.string().custom(objectId),
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
// Validation schema for getting KYC user by ID
export const getKycUser = {
    params: Joi.object({
        kycId: Joi.string().custom(objectId),
        userId: Joi.string().custom(objectId),
    }),
};
// Validation schema for updating a KYC user
export const updateKycUser = {
    body: Joi.object({
        phoneNumber: Joi.string(),
        address: Joi.string(),
        country: Joi.string(),
        documentNumber: Joi.string(),
        dateOfBirth: Joi.string(),
    }),
    files: Joi.array().items(Joi.object({
        // Schema for each uploaded file object
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: Joi.number(), // Maximum file size (1 MB)
    })),
};
// Validation schema for deleting KYC user by ID
export const deleteKycUser = {
    params: Joi.object({
        userId: Joi.string().custom(objectId),
    }),
};
// Validation schema for updating a KYC user verification status
// FAILED = 'FAILED',
// VERIFIED = 'VERIFIED',
// for each field in body object
export const updateKycUserVerificationStatus = {
    params: Joi.object().keys({
        kycId: Joi.required().custom(objectId),
    }),
    body: Joi.object({
        phoneNumber: Joi.string(),
        address: Joi.string(),
        country: Joi.string(),
        documentNumber: Joi.string(),
        documentImage: Joi.string(),
        userPhoto: Joi.string(),
        dateOfBirth: Joi.string(),
    }),
};
//# sourceMappingURL=validation.kyc.js.map