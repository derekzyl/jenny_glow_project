import { Request } from "express";
import mongoose from "mongoose";

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
}

export interface RequestBody extends Request {
  user: any;
}
