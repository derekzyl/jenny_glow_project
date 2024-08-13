import paginate from '../../paginate/paginate';
import toJSON from '../../toJSON/toJSON';
import mongoose from 'mongoose';
import { transactionTypes } from '../../../config/transactions';
import { allCurrencyCodes } from '../../setting/currencies';
const currencyExchangeOrderSchema = new mongoose.Schema({
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
    baseCurrencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CURRENCIES',
        required: true,
    },
    quoteCurrencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'CURRENCIES', required: true },
    adminChain: {
        type: String,
    },
    adminUid: {
        type: String,
    },
    status: {
        type: String,
    },
    uid: {
        type: String,
    },
    chain: {
        type: String,
    },
    creditAmount: { type: Number, required: true },
    debitAmount: { type: Number, required: true },
    network: {
        type: String,
    },
    description: {
        type: String,
    },
    networkFee: {
        type: Number,
    },
    ref: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    fee: {
        type: Number,
    },
    baseCurrencyCode: {
        type: String,
        required: true,
        uppercase: true,
        enum: allCurrencyCodes,
    },
    quoteCurrencyCode: {
        type: String,
        required: true,
        uppercase: true,
        enum: allCurrencyCodes,
    },
    baseCurrencyTransactionType: {
        type: String,
        required: true,
        uppercase: true,
        enum: transactionTypes,
    },
    quoteCurrencyTransactionType: {
        type: String,
        required: true,
        uppercase: true,
        enum: transactionTypes,
    },
    baseCurrencySent: {
        type: Boolean,
        required: true,
        default: false,
    },
    quoteCurrencyReceived: {
        type: Boolean,
        required: true,
        default: false,
    },
    feeReceived: {
        type: Boolean,
        required: true,
        default: false,
    },
    filled: {
        type: Boolean,
        required: true,
        default: false,
    },
    adminRef: {
        type: String,
    },
    adminStatus: {
        type: String,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
currencyExchangeOrderSchema.plugin(toJSON);
currencyExchangeOrderSchema.plugin(paginate);
// /**
//  * Check if exchange order exists - to avoid duplicate exchange orders
//  * @param {ObjectId} userId - The user id of the exchange creator
//  * @param {string} type - The type of exchange
//  * @param {ObjectId} [excludeOrderId] - The id of the exchange order to be excluded
//  * @returns {Promise<boolean>}
//  */
// currencyExchangeOrderSchema.static(
//   'isExists',
//   async function (
//     userId: mongoose.Types.ObjectId,
//     type: string,
//     excludeOrderId?: mongoose.Types.ObjectId
//   ): Promise<boolean> {
//     const order = await this.findOne({ userId, type, _id: { $ne: excludeOrderId } });
//     return !!order;
//   }
// );
// /**
//  * Check if order is filled
//  * @param {string} order
//  * @returns {Promise<boolean>}
//  */
// currencyExchangeOrderSchema.static('isOrderFilled', async function (orderId: mongoose.Types.ObjectId): Promise<boolean> {
//   const order = await this.findOne({ _id: { $ne: orderId } });
//   return;
// });
// currencyExchangeOrderSchema.pre('save', async function (next) {
//   const order = this;
//   order.filled = true;
//   next();
// });
const CURRENCY_PAIR_EXCHANGE_ORDERS = mongoose.model('CURRENCY_PAIR_EXCHANGE_ORDERS', currencyExchangeOrderSchema);
export default CURRENCY_PAIR_EXCHANGE_ORDERS;
//# sourceMappingURL=model.order.currency-pair.exchange.js.map