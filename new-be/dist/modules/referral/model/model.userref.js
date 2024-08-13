import { toJSON } from '../../toJSON';
import mongoose from 'mongoose';
const userReferralSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USERS',
    },
    ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USERS',
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
userReferralSchema.plugin(toJSON);
const USER_REFERRAL = mongoose.model('USER_REFERRAL', userReferralSchema);
export default USER_REFERRAL;
//# sourceMappingURL=model.userref.js.map