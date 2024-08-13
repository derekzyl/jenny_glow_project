import ApiError from '@modules/errors/ApiError';
import { logger } from '@modules/logger';
import TOKENS from '@modules/token/model.token';
import { generateAuthTokens, verifyEmailToken, verifyToken } from '@modules/token/service.token';
import tokenTypes from '@modules/token/types.token';
import { IUserDoc, IUserWithTokens } from '@modules/user/interfaces.user';
import { getUserByEmail, getUserById, updateUserById } from '@modules/user/service.user';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await TOKENS.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.userId));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    logger.info(`${error} message error`);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate ');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyEmailToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.userId));
    if (!user) {
      throw new Error();
    }
    await updateUserById(user.id, { password: newPassword });
    await TOKENS.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailOtp
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmail = async (verifyEmailOtp: any): Promise<IUserDoc | null> => {
  try {
    const verifyEmailTokenDoc = await verifyEmailToken(verifyEmailOtp, tokenTypes.VERIFY_EMAIL);

    const user = await getUserById(new mongoose.Types.ObjectId(verifyEmailTokenDoc.userId));
    if (!user) {
      throw new Error('error validating token');
    }

    await TOKENS.deleteMany({ userId: user.id, type: tokenTypes.VERIFY_EMAIL });
    const updatedUser = await updateUserById(user.id, { isEmailVerified: true });
    // if (updatedUser) {
    // }

    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed: ');
  }
};

export const checkIfEmailExist = async (email: string): Promise<boolean> => {
  const findUser = await getUserByEmail(email);
  return !!findUser;
};
