import { Document, Types } from "mongoose";

interface ReviewI extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
}

interface ReviewBodyI extends Document {
  product: string;
  rating: number;
  comment: string;
  updated_at: Date;
}
