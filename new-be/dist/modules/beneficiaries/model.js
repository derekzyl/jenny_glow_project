import toJSON from '../toJSON/toJSON';
import mongoose from 'mongoose';
const beneficiariesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USERS',
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['AIRTIME', 'DATA_BUNDLE', 'POWER', 'BANK', 'INTERNET', 'TOLL', 'CABLE'],
    },
    customer: { type: String, required: true },
    bankCode: String,
    accountName: String,
    billerName: String,
    billerNumber: String,
    itemCode: String,
    bankName: String,
    isFavorite: {
        type: Boolean,
        default: false,
    },
});
// add plugin that converts mongoose to json
beneficiariesSchema.plugin(toJSON);
/**

 */
beneficiariesSchema.static('isExists', async function ({ customer, type, userId, }) {
    const beneficiary = await this.findOne({ customer, type, userId });
    return !!beneficiary;
});
const BENEFICIARY = mongoose.model('BENEFICIARY', beneficiariesSchema);
export default BENEFICIARY;
//# sourceMappingURL=model.js.map