import { Request } from "express";
import mongoose from "mongoose";
import { PermissionsE } from "../../general_factory/interface/general_factory";

enum GenderE {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface UserI extends mongoose.Document {
  email: string | true;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  role?: mongoose.Types.ObjectId;
  isEmailVerified?: boolean;
  Token?: string;
  TokenExpires?: any;
  passwordChangedAt?: Date;
  isDeleted?: boolean;
  permissions: PermissionsE[];
}

export interface RequestBody extends Request {
  user: any;
  role: any;
  params: any;
}
