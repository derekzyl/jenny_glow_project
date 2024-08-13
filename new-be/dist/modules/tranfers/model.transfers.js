import mongoose, { Schema } from 'mongoose';
import paginate from '../paginate/paginate';
import toJSON from '../toJSON/toJSON';
const transferSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'USERS', required: true },
    txId: { type: Number, required: true },
    accountNumber: { type: String, required: true },
    bankCode: { type: String },
    fullName: { type: String, required: true },
    status: { type: String, required: true },
    reference: { type: String, required: true },
    currency: { type: String, default: 'NGN' },
    debitCurrency: { type: String, default: 'NGN' },
    amount: { type: Number, required: true },
    fee: { type: Number },
    meta: { type: Schema.Types.Mixed },
    narration: { type: String },
    completeMessage: { type: String },
    merchantName: { type: String },
    transferType: { type: String, enum: ['DEPOSIT', 'TRANSFER'], required: true },
    bankName: { type: String },
    requiresApproval: { type: Number },
    isApproved: { type: Number },
}, { timestamps: true });
// add plugin that converts mongoose to json
transferSchema.plugin(toJSON);
transferSchema.plugin(paginate);
/**
 * Check if bill payment exists - to avoid duplicate bill payments (references)
 * @param {string} reference - The bill reference
 * @param {ObjectId} [excludeBillId] - The id of the bill payment order to be excluded
 * @returns {Promise<boolean>}
 */
transferSchema.static('isExists', async function (reference, excludeBillId) {
    const currencyPair = await this.findOne({ reference, _id: { $ne: excludeBillId } });
    return !!currencyPair;
});
const TRANSFERS = mongoose.model('TRANSFERS', transferSchema);
export default TRANSFERS;
//# sourceMappingURL=model.transfers.js.map