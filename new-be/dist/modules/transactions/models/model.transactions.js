import paginate from '../../paginate/paginate';
import toJSON from '../../toJSON/toJSON';
import { easyCreated } from '../../utils/created';
import mongoose from 'mongoose';
const TransactionSchema = new mongoose.Schema(Object.assign({ trxType: {
        type: String,
        required: true,
    }, referenceId: {
        type: String,
        required: true,
    }, trxRef: {
        type: String,
        required: true,
    }, details: {
        type: String,
        required: true,
    }, amount: {
        type: Number,
        required: true,
    }, trxCrudType: {
        type: String,
        required: true,
    }, status: {
        type: String,
        required: true,
    }, paymentMethod: {
        type: String,
    }, currency: {
        type: String,
    }, taxAmount: {
        type: Number,
    }, discountAmount: {
        type: Number,
    }, shippingCost: {
        type: Number,
    }, items: [], customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USERS',
    }, supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SUPPLIER',
    }, branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BRANCH',
    }, notes: {
        type: String,
    }, info1: {
        key: String,
        value: String,
    }, info2: {
        key: String,
        value: String,
    }, info3: {
        key: String,
        value: String,
    }, info4: {
        key: String,
        value: String,
    } }, easyCreated), {
    timestamps: true,
});
// add plugin that converts mongoose to json
TransactionSchema.plugin(toJSON);
TransactionSchema.plugin(paginate);
TransactionSchema.static('isExists', async function (ref, excludeTxId) {
    const transaction = await this.findOne({ referenceId: ref, _id: { $ne: excludeTxId } });
    return !!transaction;
});
const TRANSACTION = mongoose.model('TRANSACTION', TransactionSchema);
export default TRANSACTION;
//# sourceMappingURL=model.transactions.js.map