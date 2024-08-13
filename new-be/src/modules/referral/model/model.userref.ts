import { toJSON } from '@modules/toJSON';
import mongoose from 'mongoose';
import { UserReferralIDoc, UserReferralIModel } from '../interface/interface.referral';

const userReferralSchema = new mongoose.Schema<UserReferralIDoc, UserReferralIModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USERS',
    },

    ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USERS',
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userReferralSchema.plugin(toJSON);

const USER_REFERRAL = mongoose.model('USER_REFERRAL', userReferralSchema);
export default USER_REFERRAL;
