import mongoose, { Schema } from "mongoose";
import { UserI, RoleE, UserProfileI } from "./interface/auth";

const UserSchema = new Schema<UserI>({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: RoleE,
    default: RoleE.USER,
  },
});

const UserProfileSchema = new Schema<UserProfileI>({
  full_name: {
    type: String,
  },
});

export const USER = mongoose.model("USER", UserSchema);
