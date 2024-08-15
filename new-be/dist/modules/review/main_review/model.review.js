import { Schema, model } from "mongoose";
const reviewSchema = new Schema({
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
}, { timestamps: true });
// reviewSchema.pre("findOneAndUpdate", function () {
//     this.updated_at
// })
export const REVIEW = model("REVIEW", reviewSchema);
//# sourceMappingURL=model.review.js.map