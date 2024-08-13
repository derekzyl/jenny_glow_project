import paginate from '../../paginate/paginate';
import toJSON from '../../toJSON/toJSON';
import mongoose from 'mongoose';
const giftcardExchangeOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USERS',
        required: true,
    },
    exchangeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EXCHANGES',
        required: true,
    },
    giftCardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GIFTCARDS',
        required: true,
    },
    ref: {
        type: String,
        required: true,
        unique: true,
    },
    amountInUSD: {
        type: Number,
    },
    cardPin: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'PROCESSING'],
        default: 'PENDING',
    },
    creditAmount: {
        type: Number,
    },
    expectedCreditAmount: {
        type: Number,
    },
    filled: {
        type: Boolean,
        default: false,
    },
    handledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USERS',
    },
    isBeingHandled: {
        type: Boolean,
        default: false,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
giftcardExchangeOrderSchema.plugin(toJSON);
giftcardExchangeOrderSchema.plugin(paginate);
/**
 * Check if exchange order exists - to avoid duplicate exchange orders
 * @param {ObjectId} userId - The user id of the exchange creator
 * @param {string} type - The type of exchange
 * @param {number} volume - The exchange volume
 * @param {ObjectId} [excludeOrderId] - The id of the exchange order to be excluded
 * @returns {Promise<boolean>}
 */
giftcardExchangeOrderSchema.static('isExists', async function (userId, type, volume, excludeOrderId) {
    const order = await this.findOne({ userId, type, volume, _id: { $ne: excludeOrderId } });
    return !!order;
});
// /**
//  * Check if order is filled
//  * @param {string} order
//  * @returns {Promise<boolean>}
//  */
// giftcardExchangeOrderSchema.static('isOrderFilled', async function (orderId: mongoose.Types.ObjectId): Promise<boolean> {
//   const order = await this.findOne({ _id: { $ne: orderId } });
//   return;
// });
// giftcardExchangeOrderSchema.pre('save', async function (next) {
//   const order = this;
//   order.filled = true;
//   next();
// });
const EXCHANGE_GIFTCARD_ORDERS = mongoose.model('EXCHANGE_GIFTCARD_ORDERS', giftcardExchangeOrderSchema);
export default EXCHANGE_GIFTCARD_ORDERS;
//# sourceMappingURL=model.giftcard.order.exchange.js.map