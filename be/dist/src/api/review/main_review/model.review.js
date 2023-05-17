"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REVIEW = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.REVIEW = (0, mongoose_1.model)("REVIEW", reviewSchema);
