import { toJSON } from '../../../toJSON';
import { Schema, model } from 'mongoose';
const permissionsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    details: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
permissionsSchema.plugin(toJSON);
permissionsSchema.static('isExist', async function (name, exclude) {
    const permission = await this.findOne({ name, _id: { $ne: exclude } });
    return !!permission;
});
const PERMISSIONS = model('PERMISSIONS', permissionsSchema);
export default PERMISSIONS;
//# sourceMappingURL=models.permissions.js.map