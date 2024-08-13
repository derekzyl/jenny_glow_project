import { joiQuery } from '@modules/utils/created';
import { objectId } from '@modules/validate';
import Joi from 'joi';
import { workingHoursI } from '../interface_branch/interface.branch';

const workingHoursSchema: Record<keyof Omit<workingHoursI, 'branch' | 'createdBy' | 'updatedBy'>, any> = {
  day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
  open: Joi.string()
    .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/)
    .required(), // Assuming 24-hour format
  close: Joi.string()
    .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/)
    .required(), // Assuming 24-hour format
};

export const createWorkingHours = {
  body: Joi.object().keys({
    ...workingHoursSchema,
    branch: Joi.string().required(), // Assuming ObjectId is a string
    createdBy: Joi.string().required(), // Assuming ObjectId is a string
  }),
};

export const getOneWorkingHours = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(), // Assuming ObjectId is a string
  }),
};

export const updateWorkingHours = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(), // Assuming ObjectId is a string
  }),
  body: Joi.object().keys({
    ...workingHoursSchema,
    updatedBy: Joi.string().required(), // Assuming ObjectId is a string
  }),
};

export const deleteWorkingHours = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(), // Assuming ObjectId is a string
  }),
};

export const getAllWorkingHours = {
    query: Joi.object().keys({
      ...joiQuery,
    day: Joi.string(),
    branch: Joi.string(), // Assuming ObjectId is a string
  }),
};

export const getWorkingHoursByBranch = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(), // Assuming ObjectId is a string
  }),
  query: Joi.object().keys({
 ...joiQuery,
    day: Joi.string(),
  }),
};
