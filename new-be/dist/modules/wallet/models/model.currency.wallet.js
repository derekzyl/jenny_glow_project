import paginate from '../../paginate/paginate';
import toJSON from '../../toJSON/toJSON';
import mongoose from 'mongoose';
import { FeeTypes } from '../../../config/exchanges';
import { /* allCurrencyCodes, */ currencyTypes } from '../../setting/currencies';
const currencySchema = new mongoose.Schema({
    name: {
        type: String,
        uppercase: true,
        required: true,
    },
    image: { type: String },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    symbol: {
        type: String,
        unique: true,
    },
    currencyType: {
        type: String,
        required: true,
        uppercase: true,
        enum: currencyTypes,
    },
    pricePctDifference: {
        type: Number,
        default: 0,
    },
    minDeposit: {
        type: Number,
        default: 0,
    },
    minWithdraw: {
        type: Number,
        default: 0,
    },
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    mode: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['LIVE', 'TEST'],
    },
    network: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['MAINNET', 'TESTNET'],
    },
    label: {
        type: String,
    },
    maxWithdraw: {
        type: Number,
        default: 0,
    },
    feeType: {
        type: String,
        uppercase: true,
        enum: FeeTypes,
        default: FeeTypes.percentage,
    },
    depositFee: {
        type: Number,
        default: 0,
    },
    withdrawFee: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
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
currencySchema.plugin(toJSON);
currencySchema.plugin(paginate);
/**
 * Check if currency is taken
 * @param {string} code - The currency's short code
 * @param {ObjectId} [excludeCurrencyId] - The id of the currency to be excluded
 * @returns {Promise<boolean>}
 */
currencySchema.static('isCodeTaken', async function (code, excludeCurrencyId) {
    const currency = await this.findOne({ code, _id: { $ne: excludeCurrencyId } });
    return !!currency;
});
const CURRENCIES = mongoose.model('CURRENCIES', currencySchema);
export default CURRENCIES;
//# sourceMappingURL=model.currency.wallet.js.map