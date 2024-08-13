import { objectId } from '@modules/validate';
import Joi from 'joi';

const schema = {
  userId: Joi.string().required().custom(objectId),
  nType: Joi.string().valid('email', 'notification', 'both').required(),
  body: Joi.string().required(),
  title: Joi.string().required(),
  type: Joi.string(),
};

export const sendNotification = {
  body: Joi.object().keys(schema),
};
const schem = {
  userEmail: Joi.string().required(),
  nType: Joi.string().valid('email', 'notification', 'both').required(),
  body: Joi.string().required(),
  title: Joi.string().required(),
  type: Joi.string(),
};

export const sendNotificationViaEmailAddress = {
  body: Joi.object().keys(schem),
};
