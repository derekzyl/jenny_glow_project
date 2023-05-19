import { Schema, model } from "mongoose";
import { branchI } from "../interface_branch/branch";

const branchSchema = new Schema<branchI>({
  name: { type: String, unique: true, required: true },
  location: { longitude: String, latitude: String },
  location_address: String,
  number_of_staff: Number,
  product: [
    {
      product: Schema.Types.ObjectId,
      amount_in_stock: Number,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

branchSchema.pre("save", function () {
  this.name = String(this.name).toLocaleUpperCase();
});

export const BRANCH = model("BRANCH", branchSchema);
