import { Schema, model } from "mongoose";
import { ReviewDocI } from "../interface_review/interface.review";

const reviewSchema = new Schema<ReviewDocI>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "USERS",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "PRODUCT",
      required: true,
    },
    comment: {
      type: String,
    },
    rating: {
      type: Number,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);
// reviewSchema.pre("findOneAndUpdate", function () {
//     this.updated_at
// })

export const REVIEW = model<ReviewDocI>("REVIEW", reviewSchema);
