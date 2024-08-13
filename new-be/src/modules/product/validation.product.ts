import { joiQuery } from '@modules/utils/created';
import { objectId } from '@modules/validate';
import Joi from 'joi';

// Product Variant Validation Schema
const productVariantSchema = Joi.object({
  type: Joi.string().required(),
  size: Joi.string().required(),
  price: Joi.number().positive().required(),
  image: Joi.string().required(),
});

// Create Product Validation Schema
export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  discount: Joi.number().min(0).max(100).required(),
  category: Joi.custom(objectId).required(),
  subCategory: Joi.custom(objectId).required(),
  price: Joi.number().positive().required(),
  image: Joi.string().required(),
  size: Joi.number().positive().required(),
  unit: Joi.string().required(),
  featured: Joi.boolean().optional(),
  otherImage1: Joi.string().optional(),
  otherImage2: Joi.string().optional(),
  otherImage3: Joi.string().optional(),
  productVariant: Joi.array().items(productVariantSchema).min(1).required(),
});

export const createProductVariantSchema = Joi.object({
  type: Joi.string().required(),
  size: Joi.string().required(),
  price: Joi.number().positive().required(),
  image: Joi.string().required(),
  productId: Joi.custom(objectId).required(),
});

// Update Product Validation Schema
export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  discount: Joi.number().min(0).max(100).optional(),
  category: Joi.custom(objectId).optional(),
  subCategory: Joi.custom(objectId).optional(),
  price: Joi.number().positive().optional(),
  image: Joi.string().optional(),
  size: Joi.number().positive().optional(),
  unit: Joi.string().optional(),
  featured: Joi.boolean().optional(),
  otherImage1: Joi.string().optional(),
  otherImage2: Joi.string().optional(),
  otherImage3: Joi.string().optional(),
  productVariant: Joi.array().items(productVariantSchema).optional(),
});

// ID Validation Schema
export const idParamSchema = Joi.object({
  id: Joi.custom(objectId).required(),
});

// Query Validation Schema
export const productQuerySchema = Joi.object({
  category: Joi.custom(objectId).optional(),
  subCategory: Joi.custom(objectId).optional(),
  featured: Joi.boolean().optional(),
  ...joiQuery,
});

// Update Product Variant Validation Schema
export const updateProductVariantSchema = Joi.object({
  type: Joi.string().optional(),
  size: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  image: Joi.string().optional(),
});
