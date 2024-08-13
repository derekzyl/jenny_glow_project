import { Document, Types } from "mongoose";

export interface ReviewI {
  userId: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;

  comment: string;
  isReviewed: boolean;
  isApproved: boolean;
}

export interface ReviewDocI extends Document, ReviewI {}

export type ReviewBodyT = Omit<ReviewI, "userId">;
