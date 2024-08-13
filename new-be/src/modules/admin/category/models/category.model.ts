import { paginate } from "@modules/paginate";
import { model, Schema } from "mongoose";
import { categoryDocument, categoryI, categoryModelI } from "../interface.category";

const categorySchema = new Schema<categoryDocument, categoryModelI>(
  {
    name: { type: String, required: true },
    image: String,

        createdBy: { type: Schema.Types.ObjectId, ref: 'USERS' },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'USERS' },
  },
  { timestamps: true }
);
categorySchema.pre('save', function () {
  this.name = this.name.trim().toLocaleUpperCase();
});
categorySchema.plugin(paginate);

export const CATEGORY = model<categoryI>('CATEGORY', categorySchema);
