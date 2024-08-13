import ApiError from '@modules/errors/ApiError';
import { userService } from '@modules/user';
import { IUserDoc } from '@modules/user/interfaces.user';
import { generateAlphanumericReference } from '@modules/utils';
import { GeneratekeyE } from '@modules/utils/referenceGenerator';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import mongoose from 'mongoose';
import config from '../../config/config';
import { AccessAndRefreshTokens, ITokenDoc } from './interfaces.token';
import TOKEN from './model.token';
import tokenTypes from './types.token';

/**
 * Generate token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate otp token
 * @returns {string}
 */
export const generateOtpToken = (): string => {
  // Generate a 6-digit random number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
export const saveToken = async (
  token: string,
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  blacklisted: boolean = false
): Promise<ITokenDoc> => {
  const tokenDoc = await TOKEN.create({
    token,
    userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export const verifyToken = async (token: string, type: string): Promise<ITokenDoc> => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (typeof payload.sub !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad user');
  }
  const tokenDoc = await TOKEN.findOne({
    token,
    type,
    userId: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Verify otp token and return token doc (or throw an error if it is not valid)
 * @param {mongoose.Types.ObjectId} userId
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export const verifyOtpToken = async (userId: mongoose.Types.ObjectId, token: string, type: string): Promise<ITokenDoc> => {
  const tokenDoc = await TOKEN.findOne({
    token,
    type,
    userId,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('OTP Token not found');
  }
  tokenDoc.blacklisted = true;
  tokenDoc.save();
  return tokenDoc;
};

export const verifyEmailToken = async (token: string, type: string): Promise<ITokenDoc> => {
  const tokenDoc = await TOKEN.findOne({
    token,
    type,
    blacklisted: false,
  });

  if (!tokenDoc) {
    throw new Error('OTP Token not found');
  }
  tokenDoc.blacklisted = true;
  await tokenDoc.save();
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {IUserDoc} user
 * @returns {Promise<AccessAndRefreshTokens>}
 */
export const generateAuthTokens = async (user: IUserDoc): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NO_CONTENT, '');
  }
  let resetPasswordToken = generateAlphanumericReference(6, GeneratekeyE.numbers);
  if (resetPasswordToken.length !== 6) {
    resetPasswordToken = generateAlphanumericReference(6, GeneratekeyE.numbers);
    if (resetPasswordToken.length !== 6) {
      resetPasswordToken = generateAlphanumericReference(6, GeneratekeyE.numbers);
    }
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');

  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * The function generates a reset pin token for a user based on their email address.
 *
 * @param email The `email` parameter is a string that represents the email address of the user for
 * whom you want to generate a reset PIN token.
 *
 * @return The function `generateResetPinToken` is returning a Promise that resolves to a string value,
 * which is the `resetPasswordToken`.
 */
export const generateResetPinToken = async (user: IUserDoc): Promise<string> => {
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  // const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PIN);
  let resetPasswordToken = generateAlphanumericReference(6, GeneratekeyE.numbers);
  if (resetPasswordToken.length !== 6) {
    resetPasswordToken = generateAlphanumericReference(6, GeneratekeyE.numbers);
    if (resetPasswordToken.length !== 6) {
      resetPasswordToken = generateAlphanumericReference(6, GeneratekeyE.numbers);
    }
  }

  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PIN);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {IUserDoc} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user: IUserDoc): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  // const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  let emailToken = generateAlphanumericReference(6, GeneratekeyE.numbers);
  if (emailToken.length !== 6) {
    emailToken = generateAlphanumericReference(6, GeneratekeyE.numbers);
    if (emailToken.length !== 6) {
      emailToken = generateAlphanumericReference(6, GeneratekeyE.numbers);
    }
  }
  await saveToken(emailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return emailToken;
};
