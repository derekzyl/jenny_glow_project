import paginate from '../../paginate/paginate';
import toJSON from '../../toJSON/toJSON';
import mongoose from 'mongoose';
import validator from 'validator';
import { kycTiers } from '../../setting/roles';
const kycSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        unique: true,
        required: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: (value) => validator.isMobilePhone(value),
            message: 'Invalid phone number',
        },
    },
    country: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    bvn: {
        type: String,
        trim: true,
    },
    documentNumber: {
        type: String,
    },
    documentImage: {
        type: String,
        // Add custom validation if needed for base64 format
    },
    userPhoto: {
        type: String,
        // Add custom validation if needed for base64 format
    },
    dateOfBirth: {
        type: String,
        trim: true,
        validate: {
            validator: (value) => validator.isDate(value),
            message: 'Invalid date of birth format',
        },
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    tier: {
        type: Number,
        enum: kycTiers,
        default: 0,
    },
    isComplete: {
        type: Boolean,
        default: false,
    },
    createdByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
    },
    updatedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
kycSchema.plugin(toJSON);
kycSchema.plugin(paginate);
/**
 * Check if phone number is taken
 * @param {string} phoneNumber - The user's phone number
 * @param {ObjectId} [excludeId] - The id of the kyc profile to be excluded
 * @returns {Promise<boolean>}
 */
kycSchema.static('isPhoneNumberTaken', async function (phoneNumber, excludeId) {
    const kycUser = await this.findOne({ phoneNumber, _id: { $ne: excludeId } });
    return !!kycUser;
});
/**
 * Check if bvn is taken
 * @param {string} bvn - The user's bvn
 * @param {ObjectId} [excludeId] - The id of the kyc profile to be excluded
 * @returns {Promise<boolean>}
 */
kycSchema.static('isBvnTaken', async function (bvn, excludeId) {
    const kycUser = await this.findOne({ bvn, _id: { $ne: excludeId } });
    return !!kycUser;
});
/**
 * Check if document number is taken
 * @param {string} documentNumber - The user's document number
 * @param {ObjectId} [excludeId] - The id of the kyc profile to be excluded
 * @returns {Promise<boolean>}
 */
kycSchema.static('isDocumentNumberTaken', async function (documentNumber, excludeId) {
    const kycUser = await this.findOne({ documentNumber, _id: { $ne: excludeId } });
    return !!kycUser;
});
/* async function createUniqueIndexIfModified(this: any, field: string, next: Function) {
  if (this.isModified(field) && this[field]) {
    try {
      const model = this.constructor;
      await model.createIndexes({ [field]: 1 }, { unique: true });
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
} */
// Add the pre-save middleware
/* kycSchema.pre('save', async function (next: Function) {
  await createUniqueIndexIfModified.call(this, 'phoneNumber', next);
  await createUniqueIndexIfModified.call(this, 'bvn', next);
  await createUniqueIndexIfModified.call(this, 'documentNumber', next);
  next();
}); */
const KYC = mongoose.model('KYC', kycSchema);
export default KYC;
//# sourceMappingURL=model.kyc.js.map