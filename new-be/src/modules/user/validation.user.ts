import Joi from 'joi';
import { objectId, password, pin } from '../validate/validation.custom';
import { NewCreatedUserPin } from './interfaces.pin.user';
import { NewCreatedUser } from './interfaces.user';

const createUserBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  firstName: Joi.string(),
  lastName: Joi.string(),
  role: Joi.string().required(),
  refId: Joi.string(),
};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

const createUserPin: Record<keyof Pick<NewCreatedUserPin, 'pin'>, any> = {
  pin: Joi.string().required().custom(pin),
};

export const createPin = {
  body: Joi.object().keys(createUserPin),
};
const changeUserPin: Record<keyof NewCreatedUserPin & { oldPin: string }, any> = {
  pin: Joi.string().required().custom(pin),
  oldPin: Joi.string().required().custom(pin),
};

export const changePin = {
  body: Joi.object().keys(changeUserPin),
};
export const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    role: Joi.string(),
    sort: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      firstName: Joi.string(),
      lastName: Joi.string(),
      pin: Joi.string(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const forgotPin = {
  body: Joi.object().keys({}),
};

export const resetPin = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    pin: Joi.string().required().custom(pin),
  }),
};

export const changeUserPassword = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmNewPassword: Joi.string().required(),
  }),
};
