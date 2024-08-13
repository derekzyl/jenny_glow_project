import paginate from '../paginate/paginate';
import toJSON from '../toJSON/toJSON';
import mongoose from 'mongoose';
import { billStatus } from '../../config/bills';
const billPaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USERS',
        required: true,
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WALLETS',
        required: true,
    },
    country: {
        type: String,
        required: false,
        default: 'NG',
    },
    customer: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['AIRTIME', 'DATA_BUNDLE', 'POWER', 'INTERNET', 'TOLL', 'CABLE'],
    },
    recurrence: {
        type: String,
        required: false,
        default: 'ONCE',
    },
    billerName: {
        type: String,
        required: true,
    },
    reference: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
        enum: billStatus,
    },
    token: {
        type: String,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
billPaymentSchema.plugin(toJSON);
billPaymentSchema.plugin(paginate);
/**
 * Check if bill payment exists - to avoid duplicate bill payments (references)
 * @param {string} reference - The bill reference
 * @param {ObjectId} [excludeBillId] - The id of the bill payment order to be excluded
 * @returns {Promise<boolean>}
 */
billPaymentSchema.static('isExists', async function (reference, excludeBillId) {
    const currencyPair = await this.findOne({ reference, _id: { $ne: excludeBillId } });
    return !!currencyPair;
});
const BILL_PAYMENTS = mongoose.model('BILL_PAYMENTS', billPaymentSchema);
export default BILL_PAYMENTS;
//# sourceMappingURL=model.bill.js.map