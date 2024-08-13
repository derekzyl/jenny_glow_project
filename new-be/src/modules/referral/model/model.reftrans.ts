import mongoose from 'mongoose';
import { RefTransactionIDoc, RefTransactionIModel } from '../interface/interface.referral';

const refTransactionSchema = new mongoose.Schema<RefTransactionIDoc, RefTransactionIModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USER',
      required: true,
    },
    referral: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USER',
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,

      default: 'PENDING',
    },
    fee: {
      type: Number,
    },
    transType: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const RefTransaction = mongoose.model<RefTransactionIDoc, RefTransactionIModel>('REF_TRANSACTIONS', refTransactionSchema);
export default RefTransaction;
