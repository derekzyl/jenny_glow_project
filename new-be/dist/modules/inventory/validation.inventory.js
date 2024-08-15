import { joiQuery } from '../utils/created';
import { objectId } from '../validate';
import Joi from 'joi';
// Inventory Item Validation Schema
const inventoryItemSchema = Joi.object({
    name: Joi.string().required(),
    unitPrice: Joi.number().positive().required(),
    unit: Joi.string().required(),
    size: Joi.string().required(),
    quantity: Joi.number().positive().integer().required(),
    totalPrice: Joi.number().positive().required(),
    remarks: Joi.string().optional().allow(''),
});
// Inventory Validation Schema
export const createInventorySchema = Joi.object({
    name: Joi.string().required(),
    currency: Joi.string().required(),
    inventoryReceipt: Joi.string().optional().allow(''),
    remarks: Joi.string().optional().allow(''),
    branchId: Joi.custom(objectId).required(),
    inventoryItems: Joi.array().items(inventoryItemSchema).min(1).required(),
});
// Update Inventory Schema
export const updateInventorySchema = Joi.object({
    name: Joi.string().optional(),
    currency: Joi.string().optional(),
    inventoryReceipt: Joi.string().optional().allow(''),
    remarks: Joi.string().optional().allow(''),
    branchId: Joi.custom(objectId).optional(),
    inventoryItems: Joi.array().items(inventoryItemSchema).min(1).optional(),
});
// ID Validation Schema
export const idParamSchema = Joi.object({
    id: Joi.custom(objectId).required(),
});
// Query Validation Schema
export const inventoryQuerySchema = Joi.object(Object.assign({ branchId: Joi.custom(objectId).optional(), inventoryStatus: Joi.string().valid('pending', 'approved', 'rejected').optional() }, joiQuery));
// Update Inventory Status Schema
export const updateInventoryStatusSchema = Joi.object({
    inventoryStatus: Joi.string().valid('pending', 'approved', 'rejected').required(),
});
//# sourceMappingURL=validation.inventory.js.map