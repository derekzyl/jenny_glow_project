import mongoose from 'mongoose';
import tokenTypes from './types.token';
import toJSON from '../toJSON/toJSON';
import { ITokenDoc, ITokenModel } from './interfaces.token';

const tokenSchema = new mongoose.Schema<ITokenDoc, ITokenModel>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      ref: 'USERS',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.RESET_PIN, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

const TOKENS = mongoose.model<ITokenDoc, ITokenModel>('TOKENS', tokenSchema);

export default TOKENS;
