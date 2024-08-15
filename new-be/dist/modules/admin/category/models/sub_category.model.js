import { model, Schema } from 'mongoose';
const subCategorySchema = new Schema({
    name: { type: String, required: true, uppercase: true },
    category: { type: Schema.Types.ObjectId, ref: 'CATEGORY', required: true },
    image: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'USERS',
        required: true,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'USERS',
        required: true,
    },
}, { timestamps: true });
subCategorySchema.pre('save', function () {
    this.name = this.name.trim().toLocaleUpperCase();
});
export const SUB_CATEGORY = model('SUB_CATEGORY', subCategorySchema);
//# sourceMappingURL=sub_category.model.js.map