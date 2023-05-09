import { Schema, model } from "mongoose";
import { branchI } from "../interface_branch/branch";

const branchSchema = new Schema<branchI>({
  name: String,
  location: { longitude: String, latitude: String },
  location_address: String,
  number_of_staff: Number,
  created_at: Date,
  updated_at: Date,
});

export const BRANCH = model("BRANCH", branchSchema);
