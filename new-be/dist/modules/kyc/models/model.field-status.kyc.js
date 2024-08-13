import paginate from '../../paginate/paginate';
import toJSON from '../../toJSON/toJSON';
import mongoose from 'mongoose';
import { KycFieldStates } from '../../setting/roles';
const kycFieldStatusSchema = new mongoose.Schema({
    kycId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KYC',
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        enum: Object.values(KycFieldStates),
        default: KycFieldStates.UNINITIATED,
    },
    country: {
        type: String,
        enum: Object.values(KycFieldStates),
        default: KycFieldStates.UNINITIATED,
    },
    dateOfBirth: {
        type: String,
        enum: Object.values(KycFieldStates),
        default: KycFieldStates.UNINITIATED,
    },
    address: {
        type: String,
        enum: Object.values(KycFieldStates),
        default: KycFieldStates.UNINITIATED,
    },
    bvn: {
        type: String,
        enum: Object.values(KycFieldStates),
        default: KycFieldStates.UNINITIATED,
    },
    documentNumber: {
        type: String,
        enum: Object.values(KycFieldStates),
        default: KycFieldStates.UNINITIATED,
    },
    documentImage: {
        type: String,
        enum: Object.values(KycFieldStates),
        default: KycFieldStates.UNINITIATED,
    },
    userPhoto: {
        type: String,
        enum: Object.values(KycFieldStates),
        default: KycFieldStates.UNINITIATED,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
kycFieldStatusSchema.plugin(toJSON);
kycFieldStatusSchema.plugin(paginate);
const KYC_FIELD_STATUS = mongoose.model('KYC_FIELD_STATUS', kycFieldStatusSchema);
export default KYC_FIELD_STATUS;
//# sourceMappingURL=model.field-status.kyc.js.map