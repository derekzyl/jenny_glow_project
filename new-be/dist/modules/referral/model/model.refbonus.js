import { toJSON } from '../../toJSON';
import mongoose from 'mongoose';
const refBonusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
    },
    bonus: {
        type: Number,
        default: 0,
    },
    referral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
    },
    details: {
        type: String,
    },
    type: {
        type: String,
    },
}, {
    timestamps: true,
});
refBonusSchema.plugin(toJSON);
const REF_BONUS = mongoose.model('REF_BONUS', refBonusSchema);
export default REF_BONUS;
//# sourceMappingURL=model.refbonus.js.map