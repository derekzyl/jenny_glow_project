import { joiQuery } from '../../../utils/created';
import Joi from 'joi';
export const fetchCountryAndState = {
    query: Joi.object().keys({
        country: Joi.string().optional(),
        state: Joi.string().optional(),
    }),
};
export const getOneShippingFee = {
    params: Joi.object().keys({
        id: Joi.string().required(), // Assuming ObjectId is a string
    }),
};
export const addShippingFee = {
    body: Joi.object().keys({
        country: Joi.string().required(),
        countryShippingFee: Joi.number().required(),
        states: Joi.array()
            .items(Joi.object({
            name: Joi.string().required(),
            stateShippingFee: Joi.number().required(),
        })),
        useCountryShippingFeeAsDefault: Joi.boolean().required(),
    }),
};
export const updateStateShippingFee = {
    body: Joi.object().keys({
        state: Joi.string().required(),
        stateShippingFee: Joi.number().required(),
    }),
    params: Joi.object().keys({
        id: Joi.string().required(), // Assuming ObjectId is a string
    }),
};
export const addStateShippingFee = {
    body: Joi.object().keys({
        state: Joi.string().required(),
        stateShippingFee: Joi.number().required(),
    }),
    params: Joi.object().keys({
        id: Joi.string().required(), // Assuming ObjectId is a string
    }),
};
export const updateShippingFee = {
    body: Joi.object().keys({
        countryShippingFee: Joi.number().optional(),
        states: Joi.array()
            .items(Joi.object({
            name: Joi.string().required(),
            stateShippingFee: Joi.number().required(),
        }))
            .optional(),
        useCountryShippingFeeAsDefault: Joi.boolean().optional(),
    }),
    params: Joi.object().keys({
        id: Joi.string().required(), // Assuming ObjectId is a string
    }),
};
export const deleteShippingFee = {
    params: Joi.object().keys({
        id: Joi.string().required(), // Assuming ObjectId is a string
    }),
};
export const getAllShippingFee = {
    query: Joi.object().keys(Object.assign({ country: Joi.string().optional(), state: Joi.string().optional() }, joiQuery)),
};
//# sourceMappingURL=validation.shipping.js.map