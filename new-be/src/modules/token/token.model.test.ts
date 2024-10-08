import moment from 'moment';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import config from '../../config/config';
import { NewToken } from './interfaces.token';
import tokenTypes from './types.token';
import TOKEN from './model.token';
import * as tokenService from './service.token';

const password = 'password1';
const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);

describe('Token Model', () => {
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  let newToken: NewToken;
  beforeEach(() => {
    newToken = {
      token: userOneAccessToken,
      userId: userOne._id.toHexString(),
      type: tokenTypes.REFRESH,
      expires: refreshTokenExpires.toDate(),
    };
  });

  test('should correctly validate a valid token', async () => {
    await expect(new TOKEN(newToken).validate()).resolves.toBeUndefined();
  });

  test('should throw a validation error if type is unknown', async () => {
    newToken.type = 'invalidType';
    await expect(new TOKEN(newToken).validate()).rejects.toThrow();
  });
});
