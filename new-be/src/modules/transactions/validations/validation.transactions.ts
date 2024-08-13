import { joiQuery } from '@modules/utils/created';
import { objectId } from '@modules/validate';
import Joi from 'joi';
import { TrxCrudTypes, TrxTypes } from '../interfaces/interfaces.transactions';

// Schema for creating a new transaction
const createTransactionSchema = {
  trxType: Joi.string()
    .valid(...Object.values(TrxTypes))
    .required(),
  referenceId: Joi.string().required(),
  createdBy: Joi.string().custom(objectId).required(),
  details: Joi.string().required(),
  trxCrudType: Joi.string()
    .valid(...Object.values(TrxCrudTypes))
    .required(),
  amount: Joi.number().required(),
  status: Joi.string().valid('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REJECTED').required(),
  paymentMethod: Joi.string().optional(),
  currency: Joi.string().optional(),
  taxAmount: Joi.number().optional(),
  discountAmount: Joi.number().optional(),
  shippingCost: Joi.number().optional(),
  items: Joi.array()
    .optional(),
  customerId: Joi.string().custom(objectId).optional(),
  supplierId: Joi.string().custom(objectId).optional(),
  branchId: Joi.string().custom(objectId).optional(),
  notes: Joi.string().optional(),
  info1: Joi.string().optional(),
  info2: Joi.string().optional(),
  info3: Joi.string().optional(),
  info4: Joi.string().optional(),
};

// Schema for updating a transaction
const updateTransactionSchema = {
  trxType: Joi.string()
    .valid(...Object.values(TrxTypes))
    .optional(),
  referenceId: Joi.string().optional(),
  createdBy: Joi.string().custom(objectId).optional(),
  details: Joi.string().optional(),
  trxCrudType: Joi.string()
    .valid(...Object.values(TrxCrudTypes))
    .optional(),
  amount: Joi.number().optional(),
  status: Joi.string().valid('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REJECTED').optional(),
  paymentMethod: Joi.string().optional(),
  currency: Joi.string().optional(),
  taxAmount: Joi.number().optional(),
  discountAmount: Joi.number().optional(),
  shippingCost: Joi.number().optional(),
  items: Joi.array()
    .optional(),
  customerId: Joi.string().custom(objectId).optional(),
  supplierId: Joi.string().custom(objectId).optional(),
  branchId: Joi.string().custom(objectId).optional(),
  notes: Joi.string().optional(),
  info1: Joi.string().optional(),
  info2: Joi.string().optional(),
  info3: Joi.string().optional(),
  info4: Joi.string().optional(),
};

// Schema for getting a transaction by ID
const getTransactionByIdSchema = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

// Schema for querying transactions
const queryTransactionsSchema = {
  query: Joi.object().keys({
    referenceId: Joi.string().optional(),
    status: Joi.string().valid('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REJECTED').optional(),
    trxType: Joi.string()
      .valid(...Object.values(TrxTypes))
      .optional(),

    userId: Joi.string().custom(objectId).optional(),
    id: Joi.string().custom(objectId).optional(),
...joiQuery
  }),
};

// Schema for getting user transactions
const getUserTransactionsSchema = {
  query: Joi.object().keys({
...joiQuery
  }),
};

// Schema for getting a transaction by user ID
const getUserTransactionByIdSchema = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

export {
  createTransactionSchema, getTransactionByIdSchema, getUserTransactionByIdSchema, getUserTransactionsSchema, queryTransactionsSchema, updateTransactionSchema
};

