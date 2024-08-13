import paginate from '../../paginate/paginate';
import toJSON from '../../toJSON/toJSON';
import mongoose from 'mongoose';
import { ExchangeTypes, FeeTypes } from '../../../config/exchanges';
const exchangeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ExchangeTypes,
        default: ExchangeTypes.currency_pairs,
    },
    volume: {
        type: Number,
    },
    feeType: {
        type: String,
        uppercase: true,
        enum: FeeTypes,
        default: FeeTypes.percentage,
    },
    fee: {
        type: Number,
        default: 1,
    },
    ngnToUsd: {
        type: Number,
        default: 1500,
    },
    localExchangeRateToUsd: {
        type: Number,
        default: 1200,
    },
    withdrawalFee: {
        type: Number,
        default: 1,
    },
    isDefault: {
        type: Boolean,
        required: true,
        default: false,
    },
    isActive: {
        type: Boolean,
        required: true,
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
exchangeSchema.plugin(toJSON);
exchangeSchema.plugin(paginate);
// exchangeSchema.pre('save', async function (next) {
//   if (this.isDefault) await EXCHANGES.findOneAndUpdate({ isDefault: true }, { isDefault: false });
//   next();
// });
const EXCHANGES = mongoose.model('EXCHANGES', exchangeSchema);
export default EXCHANGES;
//# sourceMappingURL=model.engine.exchange.js.map