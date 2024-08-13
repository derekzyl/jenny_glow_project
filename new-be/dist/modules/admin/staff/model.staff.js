import { paginate } from '../../paginate';
import { toJSON } from '../../toJSON';
import { Schema, model } from 'mongoose';
// Mongoose schema for Staff
const staffSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'USERS',
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    lastActiveTime: { type: Date },
    isAuthenticated: { type: Boolean },
    isActive: { type: Boolean, default: true },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String },
    address: { type: String },
    salary: { type: Number },
    hireDate: { type: Date, default: Date.now },
    benefits: { type: String },
    notes: { type: String },
    emergencyContactName: { type: String },
    emergencyContactPhone: { type: String },
}, { timestamps: true });
staffSchema.plugin(toJSON);
staffSchema.plugin(paginate);
const STAFFS = model('STAFFS', staffSchema);
export default STAFFS;
//# sourceMappingURL=model.staff.js.map