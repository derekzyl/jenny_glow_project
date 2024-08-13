import paginate from '../../paginate/paginate';
import toJSON from '../../toJSON/toJSON';
import mongoose from 'mongoose';
const giftcardSchema = new mongoose.Schema({
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GIFT_CARD_MERCHANT',
        required: true,
    },
    recipient: {
        type: String,
    },
    message: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    refBonus: {
        type: Number,
        required: true,
        default: 0,
    },
    rateInUSD: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'NGN',
        upperCase: true,
    },
    pricePctDiffrence: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
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
giftcardSchema.plugin(toJSON);
giftcardSchema.plugin(paginate);
/**
 * Check if giftcard is exists
 * @param {string} cardPin - The card's pin
 * @param {string} cardNumber - The card's number
 * @param {ObjectId} [excludeCardId] - The id of the card to be excluded
 * @returns {Promise<boolean>}
 */
giftcardSchema.static('isExists', async function (cardPin, cardNumber, excludeCardId) {
    const card = await this.findOne({ cardPin, cardNumber, _id: { $ne: excludeCardId } });
    return !!card;
});
const GIFTCARDS = mongoose.model('GIFTCARDS', giftcardSchema);
export default GIFTCARDS;
//# sourceMappingURL=model.giftcard.wallet.js.map