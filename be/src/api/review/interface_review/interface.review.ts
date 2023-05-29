import { Document, Types } from "mongoose";

export interface ReviewI extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewBodyI extends Document {
  product: string;
  rating: number;
  comment: string;
  updated_at: Date;
}
