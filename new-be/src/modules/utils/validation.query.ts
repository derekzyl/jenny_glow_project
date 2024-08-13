import Joi from "joi";

export const validationQuery = {
    
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        gte: Joi.string(),
        lte: Joi.string(),
        lt: Joi.string(),
        gt: Joi.string(),
    
}