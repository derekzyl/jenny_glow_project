import { model, Schema } from 'mongoose';
import { subCategoryDocument, subCategoryI, subCategoryModelI } from '../interface.category';
const subCategorySchema = new Schema<subCategoryDocument, subCategoryModelI>(
  {
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
  },
  { timestamps: true }
);

subCategorySchema.pre('save', function () {
  this.name = this.name.trim().toLocaleUpperCase();
});

export const SUB_CATEGORY = model<subCategoryI>('SUB_CATEGORY', subCategorySchema);
