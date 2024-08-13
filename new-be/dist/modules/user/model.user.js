import paginate from '../paginate/paginate';
import toJSON from '../toJSON/toJSON';
import { encryptMe } from '../utils/encrypt';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';
const role = encryptMe('user');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    refId: {
        type: String,
    },
    isAbove18: { type: Boolean, default: true },
    privacyAndPolicy: { type: Boolean, default: true },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
        private: true, // used by the toJSON plugin
    },
    role: {
        type: String,
        default: role,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
});
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
});
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});
const USERS = mongoose.model('USERS', userSchema);
export default USERS;
//# sourceMappingURL=model.user.js.map