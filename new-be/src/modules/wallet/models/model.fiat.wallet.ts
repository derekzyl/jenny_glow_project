import paginate from '@modules/paginate/paginate';
import toJSON from '@modules/toJSON/toJSON';
import mongoose from 'mongoose';

import { FiatCurrencyCodes } from '@modules/setting/currencies';
import { IFiatWalletDoc, IFiatWalletModel } from '../interfaces/interfaces.fiat.wallet';

const walletSchema = new mongoose.Schema<IFiatWalletDoc, IFiatWalletModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USERS',
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: 'https://res.cloudinary.com/cybergenii/image/upload/v1710092160/naira_q0vue4.png',
    },
    currencyCode: {
      type: String,
      required: true,
      uppercase: true,
      enum: FiatCurrencyCodes,
      default: 'NGN',
    },
    balance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    isExchange: {
      type: Boolean,
      default: false,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
walletSchema.plugin(toJSON);
walletSchema.plugin(paginate);

/**
 * Check if the wallet exists
 * @param {ObjectId} userId - The user id
 * @param {string} currencyCode - The currency code
 * @param {ObjectId} [excludeWalletId] - The id of the wallet to be excluded
 * @returns {Promise<boolean>}
 */
walletSchema.static(
  'isExists',
  async function (
    userId: mongoose.Types.ObjectId,
    currencyCode: string,
    excludeWalletId?: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const wallet = await this.findOne({ userId, currencyCode, _id: { $ne: excludeWalletId } });
    return !!wallet;
  }
);

const FIAT_WALLETS = mongoose.model<IFiatWalletDoc, IFiatWalletModel>('FIAT_WALLETS', walletSchema);

export default FIAT_WALLETS;

// https://github.com/dipo0x/Ranode/
// https://github.com/Olanetsoft/wallet-demo-with-flutterwave
