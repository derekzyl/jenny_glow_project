import { joiQuery } from '@modules/utils/created';
import { regexPhone } from '@modules/utils/utils';
import { objectId } from '@modules/validate';
import Joi from 'joi';

// Address Validation Schema
export const addressSchema = Joi.object({
  userId: Joi.custom(objectId).required(),
  address: Joi.string().required(),
  phone: Joi.string().pattern(regexPhone).required().messages({
    'string.pattern.base': 'Invalid phone number format.',
  }),
  country: Joi.string().required(),
  state: Joi.string().required(),
  localGovernment: Joi.string().required(),
  name: Joi.string().required(),
  zipCode: Joi.string().optional(),
  isDefault: Joi.boolean().optional(),
});

// Update Address Validation Schema
export const updateAddressSchema = Joi.object({
  address: Joi.string().optional(),
  phone: Joi.string().pattern(regexPhone).optional().messages({
    'string.pattern.base': 'Invalid phone number format.',
  }),
  country: Joi.string().optional(),
  state: Joi.string().optional(),
  localGovernment: Joi.string().optional(),
  name: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  isDefault: Joi.boolean().optional(),
});

// Address ID Validation Schema
export const addressIdParamSchema = Joi.object({
  id: Joi.custom(objectId).required(),
});

// Query Address Validation Schema
export const addressQuerySchema = Joi.object({
  userId: Joi.custom(objectId).optional(),
  country: Joi.string().optional(),
  state: Joi.string().optional(),
  localGovernment: Joi.string().optional(),
  name: Joi.string().optional(),
  isDefault: Joi.boolean().optional(),
  ...joiQuery,
});
