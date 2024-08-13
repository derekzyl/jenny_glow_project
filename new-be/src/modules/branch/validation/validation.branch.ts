import { joiQuery } from '@modules/utils/created';
import Joi from 'joi';
import { branchBodyT } from '../interface_branch/interface.branch';

const locationSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  address: Joi.string().required(),
});

const branchBodySchema: Record<keyof branchBodyT, any> = {
  name: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  location: locationSchema.required(),
  locationAddress: Joi.string().required(),
  branchType: Joi.string().valid('LOCAL', 'ONLINE').required(), // Add actual branch types here
  branchManager: Joi.string().required(), // Assuming ObjectId is a string
  contactNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  createdBy: Joi.string().required(),

  servicesOffered: Joi.array().items(Joi.string()).required(),

  establishedDate: Joi.date().optional(),
  isActive: Joi.boolean().optional(),

  workingHours: Joi.array()
    .items(
      Joi.object({
        day: Joi.string().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
      })
    )
    .optional(),
};

export const createBranch = {
  body: Joi.object().keys(branchBodySchema),
};

export const getOneBranch = {
  params: Joi.object().keys({
    id: Joi.string().required(), // Assuming ObjectId is a string
  }),
};

export const updateBranch = {
  params: Joi.object().keys({
    id: Joi.string().required(), // Assuming ObjectId is a string
  }),
  body: Joi.object().keys(branchBodySchema),
};

export const deleteBranch = {
  params: Joi.object().keys({
    id: Joi.string().required(), // Assuming ObjectId is a string
  }),
};

export const getAllBranch = {
    query: Joi.object().keys({
      ...joiQuery,
    name: Joi.string(),
    country: Joi.string(),
    state: Joi.string(),
  }),
};

export const getBranchByCode = {
  params: Joi.object().keys({
    id: Joi.string().required(), // Assuming ObjectId is a string
  }),
};

export const getBranchByName = {
  params: Joi.object().keys({
    id: Joi.string().required(), // Assuming ObjectId is a string
  }),
};
