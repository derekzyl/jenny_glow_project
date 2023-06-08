import { Schema, model } from "mongoose";
import { StaffI } from "../interface_staff/interface.staff";

const staffSchema = new Schema<StaffI>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "USER",
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  address: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  bank_details: {
    bank_name: String,
    account_number: Number,
    account_name: String,
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "BRANCH",
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

export const STAFF = model("STAFF", staffSchema);
