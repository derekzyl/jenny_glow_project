import { joiQuery } from '../../utils/created';
import { GeneralStatus } from '../../utils/utils';
import { objectId } from '../../validate';
import Joi from 'joi';
// Stock Transfer Product Validation Schema
const stockTransferProductSchema = Joi.object({
    product: Joi.custom(objectId).required(),
    productTotalCount: Joi.number().positive().integer().required(),
});
// Create Stock Transfer Validation Schema
export const createStockTransferSchema = Joi.object({
    products: Joi.array().items(stockTransferProductSchema).min(1).required(),
    fromBranch: Joi.custom(objectId).required(),
    toBranch: Joi.custom(objectId).required(),
    note: Joi.string().optional().allow(''),
    transferType: Joi.string(),
});
// Update Stock Transfer Validation Schema
export const updateStockTransferSchema = Joi.object({
    products: Joi.array().items(stockTransferProductSchema).min(1).optional(),
    note: Joi.string().optional().allow(''),
    transferType: Joi.string().optional(),
});
// ID Validation Schema
export const idParamSchema = Joi.object({
    id: Joi.custom(objectId).required(),
});
// Query Validation Schema
export const stockTransferQuerySchema = Joi.object(Object.assign({ fromBranch: Joi.custom(objectId).optional(), toBranch: Joi.custom(objectId).optional(), transferStatus: Joi.string().valid(Object.values(GeneralStatus)).optional() }, joiQuery));
// Update Stock Transfer Status Schema
export const updateStockTransferStatusSchema = Joi.object({
    transferStatus: Joi.string().valid(Object.values(GeneralStatus)).required(),
});
//# sourceMappingURL=validation.stock_transfer.js.map