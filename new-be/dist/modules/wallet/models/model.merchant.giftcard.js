import paginate from '../../paginate/paginate';
import toJSON from '../../toJSON/toJSON';
import mongoose from 'mongoose';
const giftCardMerchantSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
giftCardMerchantSchema.plugin(toJSON);
giftCardMerchantSchema.plugin(paginate);
giftCardMerchantSchema.static('isExists', async function (name, excludeCardId) {
    const card = await this.findOne({ name, _id: { $ne: excludeCardId } });
    return !!card;
});
const GIFT_CARD_MERCHANT = mongoose.model('GIFT_CARD_MERCHANT', giftCardMerchantSchema);
export default GIFT_CARD_MERCHANT;
//# sourceMappingURL=model.merchant.giftcard.js.map