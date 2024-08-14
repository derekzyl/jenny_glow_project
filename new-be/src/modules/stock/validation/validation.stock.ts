import { joiQuery } from '@modules/utils/created';
import { GeneralStatus } from '@modules/utils/utils';
import { objectId } from '@modules/validate';
import Joi from 'joi';

// New Stock Validation Schema
export const createStockSchema = Joi.object({
  productId: Joi.custom(objectId).required(),
  amountInStock: Joi.number().positive().integer().required(),
  branchId: Joi.custom(objectId).required(),
  stockType: Joi.string(),
  stockStatus: Joi.string().valid(Object.values(GeneralStatus)).required(),
});

// Add to Stock Validation Schema
export const addToStockSchema = Joi.object({
  productId: Joi.custom(objectId).required(),
  branchId: Joi.custom(objectId).required(),
  amount: Joi.number().positive().integer().required(),
  stockType: Joi.string(),
});

// Remove from Stock Validation Schema
export const removeFromStockSchema = Joi.object({
  productId: Joi.custom(objectId).required(),
  branchId: Joi.custom(objectId).required(),
  amount: Joi.number().positive().integer().required(),
  stockType: Joi.string(),
});

// Update Stock Validation Schema
export const updateStockSchema = Joi.object({
  productId: Joi.custom(objectId).optional(),
  amountInStock: Joi.number().positive().integer().optional(),
  branchId: Joi.custom(objectId).optional(),
  stockType: Joi.string().optional(),
  stockStatus: Joi.string().valid(Object.values(GeneralStatus)).optional(),
});

// Stock ID Validation Schema
export const stockIdParamSchema = Joi.object({
  id: Joi.custom(objectId).required(),
});

// Query Stock Validation Schema
export const stockQuerySchema = Joi.object({
  productId: Joi.custom(objectId).optional(),
  branchId: Joi.custom(objectId).optional(),
  stockType: Joi.string().optional(),
  stockStatus: Joi.string().valid(Object.values(GeneralStatus)).optional(),
  ...joiQuery,
});
