/* eslint-disable import/prefer-default-export */
import * as dotenv from 'dotenv';
import config from '../../../config/config';

dotenv.config();

export const transactionnHash = (hash: string): boolean => {
  // Ensure both strings have the same length to prevent timing attacks
  if (hash.length !== config.flutterwaveAPI.hash.length) {
    return false;
  }

  if (hash !== config.flutterwaveAPI.hash) {
    return false;
  }

  // If all characters match, return true
  return true;
};
