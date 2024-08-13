import paginate from '@modules/paginate/paginate';
import toJSON from '@modules/toJSON/toJSON';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { IUserPinDoc, IUserPinModel } from './interfaces.pin.user';

const userPinSchema = new mongoose.Schema<IUserPinDoc, IUserPinModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USER',
      unique: true,
      required: true,
    },
    pin: {
      type: String,
      required: true,
      trim: true,
      length: 6,
      validate(value: string) {
        if (!value.match(/^\d{6}$/)) {
          throw new Error('Pin must be a 6-digit number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    pinAttempts: {
      type: Number,
      default: 0,
    },
    pinAttemptTime: String,
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userPinSchema.plugin(toJSON);
userPinSchema.plugin(paginate);

/**
 * Check if pin matches the user's transaction pin
 * @param {string} pin
 * @returns {Promise<boolean>}
 */
userPinSchema.method('isPinMatch', async function (pin: string): Promise<boolean> {
  const user = this;
  return bcrypt.compare(pin, user.pin);
});

userPinSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('pin')) {
    user.pin = await bcrypt.hash(user.pin, 8);
  }

  next();
});

const USER_PINS = mongoose.model<IUserPinDoc, IUserPinModel>('USER_PINS', userPinSchema);

export default USER_PINS;
