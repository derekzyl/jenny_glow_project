import mongoose, { Schema } from "mongoose";
import { UserI } from "../interface_auth/auth";

const UserSchema = new Schema<UserI>({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  Token: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ROLE",
    required: [true, "the user role is required"],
  },
});

export const USER = mongoose.model("USER", UserSchema);
