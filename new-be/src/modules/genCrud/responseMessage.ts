/* eslint-disable @typescript-eslint/naming-convention */
import * as dotenv from 'dotenv';

import config from '../../config/config';
import { CustomMessageI } from './interface.crud';

dotenv.config();
/**
 *
 * @param {CustomMessageI} msg
 * @returns
 */
function responseMessage<V>(msg: CustomMessageI<V>) {
  const { message, success_status, data, doc_length, error, stack } = msg;
  if (success_status) {
    return { message, data, success: success_status, doc_length };
  }
  return { message, error, success: success_status, stack: config.env === 'development' ? stack : {} };
}
export default responseMessage;
