import { paginate } from '../../../paginate';
import { toJSON } from '../../../toJSON';
import { Schema, model } from 'mongoose';
const rolesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    permissions: { type: Schema.Types.Mixed },
    details: { type: String },
}, { timestamps: true });
rolesSchema.plugin(toJSON);
rolesSchema.plugin(paginate);
rolesSchema.static('isExist', async function (name, exclude) {
    const role = await this.findOne({ name, _id: { $ne: exclude } });
    return !!role;
});
rolesSchema.pre('save', async function () {
    this.permissions = Array.from(new Set(this.permissions));
    this.name = this.name.toLowerCase();
});
const ROLES = model('ROLES', rolesSchema);
export default ROLES;
//# sourceMappingURL=model.roles.js.map