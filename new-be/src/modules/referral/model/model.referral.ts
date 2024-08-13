import { toJSON } from '@modules/toJSON';
import mongoose from 'mongoose';
import { ReferralIDoc, ReferralIModel } from '../interface/interface.referral';

const referralSchema = new mongoose.Schema<ReferralIDoc, ReferralIModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USER',

      required: true,
      unique: true,
    },
    refId: {
      type: String,
      required: true,
    },
    refBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USER',
    },
    refBalance: {
      type: Number,
      required: true,
    },
    totalRef: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

referralSchema.plugin(toJSON);

referralSchema.static('isRefUsed', async function (refId: string, excludeUserId: mongoose.Types.ObjectId): Promise<boolean> {
  const ref = await this.findOne({ refId, _id: { $ne: excludeUserId } });
  return !!ref;
});

const REFERRAL = mongoose.model('REFERRAL', referralSchema);
export default REFERRAL;
