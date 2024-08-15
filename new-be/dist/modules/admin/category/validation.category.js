import { validationQuery } from "../../utils/validation.query";
import { objectId } from "../../validate";
import Joi from "joi";
export const createCategoryBody = {
    name: Joi.string().required(),
    image: Joi.string(),
};
export const createCategory = {
    body: Joi.object().keys(createCategoryBody),
    files: Joi.array()
        .items(Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: Joi.number().max(5),
    }))
        .allow(null),
};
export const getCategory = {
    query: Joi.object().keys(Object.assign(Object.assign({}, validationQuery), { name: Joi.string() })),
};
export const updateCategory = {
    body: Joi.object().keys({
        name: Joi.string(),
        image: Joi.string(),
        subCategory: Joi.array().items(Joi.string()),
    }),
    params: Joi.object({
        categoryId: Joi.custom(objectId).required(),
    }),
    files: Joi.array()
        .items(Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: Joi.number().max(5),
    }))
        .allow(null),
};
export const getOneCategory = {
    params: Joi.object({
        categoryId: Joi.custom(objectId).required(),
    }),
};
export const subCategoryBody = {
    name: Joi.string().required(),
    image: Joi.string(),
    category: Joi.custom(objectId).required(),
};
export const createSubCategory = {
    body: Joi.object().keys(subCategoryBody),
    files: Joi.array()
        .items(Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: Joi.number().max(5),
    }))
        .allow(null),
};
export const getSubCategory = {
    query: Joi.object().keys(Object.assign(Object.assign({}, validationQuery), { name: Joi.string() })),
};
export const updateSubCategory = {
    body: Joi.object().keys({
        name: Joi.string(),
        image: Joi.string(),
        category: Joi.custom(objectId),
    }),
    params: Joi.object({
        subCategoryId: Joi.custom(objectId).required(),
    }),
    files: Joi.array()
        .items(Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        size: Joi.number().max(5),
    }))
        .allow(null),
};
export const getOneSubCategory = {
    params: Joi.object({
        subCategoryId: Joi.custom(objectId).required(),
    }),
};
//# sourceMappingURL=validation.category.js.map