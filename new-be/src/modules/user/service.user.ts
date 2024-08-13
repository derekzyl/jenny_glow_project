import ApiError from '@modules/errors/ApiError';
import { logger } from '@modules/logger';
import { sendNotification } from '@modules/notification/service.notification';
import { IOptions, QueryResult } from '@modules/paginate/paginate';
import { TOKENS, tokenTypes } from '@modules/token';
import { verifyOtpToken } from '@modules/token/service.token';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { IUserPinDoc, NewCreatedUserPin, UpdateUserPinBody } from './interfaces.pin.user';
import { IUserDoc, NewCreatedUser, NewRegisteredUser, UpdateUserBody, UpdateUserPasswordBody } from './interfaces.user';
import USER_PINS from './model.pin.user';
import USERS from './model.user';

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (await USERS.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return USERS.create(userBody);
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserDoc> => {
  if (await USERS.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return USERS.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await USERS.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  logger.info(`Get user by id: ${id}`);
  const user = await USERS.findById(id);
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> => {
  const user = await USERS.findOne({ email });

  return user;
};

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await USERS.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await USERS.findByIdAndDelete(user._id);
  return user;
};

/**
 * change user password by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const changeUserPasswordById = async (
  userId: mongoose.Types.ObjectId,
  updatePasswordBody: UpdateUserPasswordBody
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!(await user.isPasswordMatch(updatePasswordBody.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  if (updatePasswordBody.newPassword !== updatePasswordBody.confirmNewPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The new passwords do not match');
  }

  user.password = updatePasswordBody.newPassword;
  user.save();

  return user;
};
/**
 * Get user pin by user id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserPinDoc | null>}
 */
export const getUserPinByUserId = async (userId: mongoose.Types.ObjectId): Promise<IUserPinDoc | null> =>
  USER_PINS.findOne({ userId });
/**
 * Create a user pin
 * @param {NewCreatedUserPin} userPinBody
 * @returns {Promise<IUserPinDoc>}
 */
export const createUserPin = async (
  userPinBody: NewCreatedUserPin & { userId: mongoose.Types.ObjectId }
): Promise<IUserPinDoc> => {
  const user = await getUserById(userPinBody.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email not verified');
  }

  const c = await USER_PINS.create(userPinBody);
  return c;
};
export async function checkIfUserHasCreatedPin(userId: mongoose.Types.ObjectId): Promise<boolean> {
  const data = await USER_PINS.findOne({ userId });
  return !!data;
}

export const changeUserPin = async (userPinBody: {
  pin: string;
  userId: mongoose.Types.ObjectId;
  oldPin: string;
}): Promise<IUserPinDoc> => {
  const userPin = await getUserPinByUserId(userPinBody.userId);
  if (!userPin) throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  const pin = await userPin.isPinMatch(userPinBody.oldPin);
  if (!pin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'incorrect pin');
  }
  userPin.pin = userPinBody.pin;
  await userPin.save();
  await sendNotification({
    body: `your pin has been changed successfully`,
    title: 'Pin Change',

    type: 'Pin Change',
    nType: 'both',
    userId: userPinBody.userId,
  });
  return userPin;
};

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserPinDoc | null>}
 */
export const updateUserPinByUserId = async (
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserPinBody
): Promise<IUserPinDoc | null> => {
  const userPin = await getUserPinByUserId(userId);
  if (!userPin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User pin not found');
  }

  if (updateBody.otpCode && !(await verifyOtpToken(userId, updateBody.otpCode, tokenTypes.RESET_PIN))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect otp code');
  }

  await TOKENS.deleteMany({ user: userId, type: tokenTypes.RESET_PIN, blacklisted: true });

  Object.assign(userPin, updateBody);

  await userPin.save();
  await sendNotification({
    body: `your pin has been updated successfully`,
    title: 'Pin Update',

    type: 'Pin Update',
    nType: 'both',
    userId,
  });
  return userPin;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserPinDoc | null>}
 */
export const deleteUserPinByUserId = async (userId: mongoose.Types.ObjectId): Promise<IUserPinDoc | null> => {
  const userPin = await getUserPinByUserId(userId);
  if (!userPin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User pin not found');
  }
  await USER_PINS.deleteOne();
  return userPin;
};

/**
 * verify a user with transaction pin
 * @param {mongoose.Types.ObjectId} id
 * @param {string} pin
 * @returns {Promise<IUserDoc>}
 */
export const verifyUserWithPin = async (id: mongoose.Types.ObjectId, pin: string): Promise<IUserDoc> => {
  logger.info(`pin ${pin}`);
  const userPin = await getUserPinByUserId(id);
  if (!userPin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user pin not found');
  }
  if (userPin.pinAttempts >= 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'please reset pin you have made 5 retries');
  }

  if (!(await userPin.isPinMatch(pin))) {
    const currentTime = new Date();
    if (userPin.pinAttempts + 1 < 3) {
      await USER_PINS.findByIdAndUpdate(userPin._id, { pinAttempts: userPin.pinAttempts + 1 });

      throw new ApiError(httpStatus.BAD_REQUEST, `incorrect pin ${5 - userPin.pinAttempts + 1} retries remaining`);
    }
    if (userPin.pinAttempts + 1 === 3) {
      // Add desired seconds to the current time
      const secondsToAdd = 600; // Change this to the number of seconds you want to add
      const futureTimeInSeconds = new Date(currentTime.getTime() + secondsToAdd * 1000); // 1000 milliseconds in a second

      await USER_PINS.findByIdAndUpdate(userPin._id, {
        pinAttempts: userPin.pinAttempts + 1,
        pinAttemptTime: futureTimeInSeconds,
      });
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `incorrect pin ${5 - userPin.pinAttempts + 1} retries remaining \n retry after 5 mins `
      );
    }
    if (userPin.pinAttempts + 1 > 3) {
      if (new Date(userPin.pinAttemptTime).getTime() > new Date().getTime()) {
        const t = Math.abs(Date.now() - new Date(userPin.pinAttemptTime).getTime());
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `incorrect pin ${5 - userPin.pinAttempts + 1} retries remaining \n retry after ${Math.floor(t / 1000 / 60)} mins`
        );
      } else {
        await USER_PINS.findByIdAndUpdate(userPin._id, {
          pinAttempts: userPin.pinAttempts + 1,
        });
        throw new ApiError(httpStatus.BAD_REQUEST, `incorrect pin ${5 - userPin.pinAttempts + 1} retries remaining`);
      }
    }
  }
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await USER_PINS.findByIdAndUpdate(userPin._id, { pinAttempts: 0 });
  return user;
};
