import { objectId } from '@modules/validate';
import Joi from 'joi';

export const createVirtual = {
  bvn: Joi.string()
    .required()
    .length(11)
    .pattern(/^[0-9]+$/),
};

export const virtualCreateBody = {
  body: Joi.object().keys(createVirtual),
};

const fetchVirtualAccountByWalletId = {
  walletId: Joi.string().custom(objectId),
};

const fetchVirtualAccountById = {
  id: Joi.string().custom(objectId),
};

export const virtualFetchById = {
  params: Joi.object().keys(fetchVirtualAccountById),
};
export const virtualFetchByWalletId = {
  body: Joi.object().keys(fetchVirtualAccountByWalletId),
};

export const virtualDeleteById = {
  params: Joi.object().keys(fetchVirtualAccountById),
};
