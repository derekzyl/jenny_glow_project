import { Schema, model } from "mongoose";
import { ReviewI } from "../interface_review/interface.review";

const reviewSchema = new Schema<ReviewI>({
  user: {
    type: Schema.Types.ObjectId,
  },
  product: {
    type: Schema.Types.ObjectId,
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
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
// reviewSchema.pre("findOneAndUpdate", function () {
//     this.updated_at
// })

export const REVIEW = model<ReviewI>("REVIEW", reviewSchema);
