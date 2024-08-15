import Joi from "joi";
import { Schema } from "mongoose";
export const easyCreated = {
    createdBy: { type: Schema.Types.ObjectId, ref: 'USERS' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'USERS' },
};
export const joiQuery = { sort: Joi.string(), limit: Joi.number().integer(), page: Joi.number().integer(), gte: Joi.string(), lte: Joi.string(), eq: Joi.string(), ne: Joi.string(), gt: Joi.string(), lt: Joi.string(), projectBy: Joi.string() };
//# sourceMappingURL=created.js.map