import paginate from '@modules/paginate/paginate';
import toJSON from '@modules/toJSON/toJSON';
import mongoose from 'mongoose';
// import { cryptoCurrencyCodes } from '../../../config/currencies';
import { ICryptoHDWalletDoc, ICryptoHDWalletModel } from '../interfaces/interfaces.crypto.wallet';

/* The code is defining a Mongoose schema for a crypto HD wallet. */
const cryptoHDWalletSchema = new mongoose.Schema<ICryptoHDWalletDoc, ICryptoHDWalletModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USERS',
      required: true,
      private: true,
    },
    image: { type: String },
    currencyCode: {
      type: String,
      required: true,
      uppercase: true,
    },
    address: {
      type: String,
      required: true,
    },

    balance: {
      type: String,
      default: '0',
    },
    pending: {
      type: String,
      default: '0',
    },
    received: {
      type: String,
      default: '0',
    },
    blocked: {
      type: String,
      default: '0',
    },
    sent: {
      type: String,
      default: '0',
    },

    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    isExchange: {
      type: Boolean,
      required: true,
      default: false,
      private: true,
    },
    uid: {
      type: String,
      required: true,
      private: true,
      unique: true, // Ensure unique UIDs for data integrity and address id for bitpwr
    },
    guid: {
      type: String,
      required: true,
      private: true,
      unique: true, // Ensure unique GUIDs for data integrity and address id for bitpwr
    },

    addressRef: String,
    mode: {
      type: String,
      enum: ['TEST', 'LIVE'],
      required: true,
    },
    network: {
      type: String,
      enum: ['TESTNET', 'MAINNET'],
      required: true,
    },
    assetType: { type: String, required: true, uppercase: true }, // BTC | ETH
    addressType: { type: String, required: true, uppercase: true }, // BTC | ETH
    isContract: Boolean,
    isChangeAddress: Boolean,
    derivationIndex: Number,
    label: String,
    chain: String,
    assetId: String,
    organizationId: String,
    used: Boolean,
    addressContractIdentifier: mongoose.Schema.Types.Mixed, // Allow for flexible data
    deploymentParams: mongoose.Schema.Types.Mixed, // Allow for flexible data
    lastUsedAt: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
cryptoHDWalletSchema.plugin(toJSON);
cryptoHDWalletSchema.plugin(paginate);

/**
 * Check if the wallet exists
 * @param {ObjectId} userId - The user id
 * @param {string} currencyCode - The crypto currency code
 * @param {ObjectId} [excludeId] - The id of the hd wallet to be excluded
 * @returns {Promise<boolean>}
 */
cryptoHDWalletSchema.static(
  'isExists',
  async function (
    userId: mongoose.Types.ObjectId,
    currencyCode: string,
    excludeId?: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const wallet = await this.findOne({ userId, currencyCode, _id: { $ne: excludeId } });
    return !!wallet;
  }
);

const CRYPTO_HD_WALLETS = mongoose.model<ICryptoHDWalletDoc, ICryptoHDWalletModel>(
  'CRYPTO_HD_WALLETS',
  cryptoHDWalletSchema
);

export default CRYPTO_HD_WALLETS;
