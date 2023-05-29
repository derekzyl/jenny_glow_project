import { Schema, model } from "mongoose";
import { BranchTypeE, branchI } from "../interface_branch/interface.branch";

const branchSchema = new Schema<branchI>({
  name: { type: String, unique: true, required: true },
  location: { longitude: String, latitude: String },
  location_address: String,
  country: String,
  number_of_staff: Number,
  product: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "PRODUCT",
      },
      amount_in_stock: Number,
    },
  ],
  branch_type: {
    type: String,
    enum: BranchTypeE,
    default: BranchTypeE.LOCAL,
  },
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
