import { toJSON } from '../../toJSON';
import mongoose from 'mongoose';
const referralSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
        unique: true,
    },
    refId: {
        type: String,
        required: true,
    },
    refBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
    },
    refBalance: {
        type: Number,
        required: true,
    },
    totalRef: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
referralSchema.plugin(toJSON);
referralSchema.static('isRefUsed', async function (refId, excludeUserId) {
    const ref = await this.findOne({ refId, _id: { $ne: excludeUserId } });
    return !!ref;
});
const REFERRAL = mongoose.model('REFERRAL', referralSchema);
export default REFERRAL;
//# sourceMappingURL=model.referral.js.map