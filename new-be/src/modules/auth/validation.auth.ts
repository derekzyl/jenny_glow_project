import Joi from 'joi';
import { NewRegisteredUser } from '../user/interfaces.user';
import { password } from '../validate/validation.custom';

const registerBody: Record<keyof NewRegisteredUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  refBy: Joi.string(),
};

export const register = {
  body: Joi.object().keys(registerBody),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export const checkIfEmailExist = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};