import paginate from '../paginate/paginate';
import toJSON from '../toJSON/toJSON';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
const userPinSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        unique: true,
        required: true,
    },
    pin: {
        type: String,
        required: true,
        trim: true,
        length: 6,
        validate(value) {
            if (!value.match(/^\d{6}$/)) {
                throw new Error('Pin must be a 6-digit number');
            }
        },
        private: true, // used by the toJSON plugin
    },
    pinAttempts: {
        type: Number,
        default: 0,
    },
    pinAttemptTime: String,
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
userPinSchema.plugin(toJSON);
userPinSchema.plugin(paginate);
/**
 * Check if pin matches the user's transaction pin
 * @param {string} pin
 * @returns {Promise<boolean>}
 */
userPinSchema.method('isPinMatch', async function (pin) {
    const user = this;
    return bcrypt.compare(pin, user.pin);
});
userPinSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('pin')) {
        user.pin = await bcrypt.hash(user.pin, 8);
    }
    next();
});
const USER_PINS = mongoose.model('USER_PINS', userPinSchema);
export default USER_PINS;
//# sourceMappingURL=model.pin.user.js.map