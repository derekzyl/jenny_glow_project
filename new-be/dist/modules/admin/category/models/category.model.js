import { paginate } from "../../../paginate";
import { model, Schema } from "mongoose";
const categorySchema = new Schema({
    name: { type: String, required: true },
    image: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'USERS' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'USERS' },
}, { timestamps: true });
categorySchema.pre('save', function () {
    this.name = this.name.trim().toLocaleUpperCase();
});
categorySchema.plugin(paginate);
export const CATEGORY = model('CATEGORY', categorySchema);
//# sourceMappingURL=category.model.js.map