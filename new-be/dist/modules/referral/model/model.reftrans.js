import mongoose from 'mongoose';
const refTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
    },
    referral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: 'PENDING',
    },
    fee: {
        type: Number,
    },
    transType: {
        type: String,
    },
    type: {
        type: String,
    },
}, { timestamps: true });
const RefTransaction = mongoose.model('REF_TRANSACTIONS', refTransactionSchema);
export default RefTransaction;
//# sourceMappingURL=model.reftrans.js.map