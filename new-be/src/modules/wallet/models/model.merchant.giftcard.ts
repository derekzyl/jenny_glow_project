import paginate from '@modules/paginate/paginate';
import toJSON from '@modules/toJSON/toJSON';
import mongoose from 'mongoose';
import { GiftCardMerchantDocI, GiftCardMerchantModelI } from '../interfaces/interfaces.giftcard.wallet';

const giftCardMerchantSchema = new mongoose.Schema<GiftCardMerchantDocI, GiftCardMerchantModelI>(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    active: { type: Boolean, default: true },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USERS',
      required: true,
    },
    updatedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'USERS',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
giftCardMerchantSchema.plugin(toJSON);
giftCardMerchantSchema.plugin(paginate);

giftCardMerchantSchema.static(
  'isExists',
  async function (name: string, excludeCardId: mongoose.Types.ObjectId): Promise<boolean> {
    const card = await this.findOne({ name, _id: { $ne: excludeCardId } });
    return !!card;
  }
);

const GIFT_CARD_MERCHANT = mongoose.model<GiftCardMerchantDocI, GiftCardMerchantModelI>(
  'GIFT_CARD_MERCHANT',
  giftCardMerchantSchema
);

export default GIFT_CARD_MERCHANT;
