import { easyCreated } from "../../utils/created";
import { Schema, model } from "mongoose";
const productSchema = new Schema(Object.assign({ name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    }, description: {
        type: String,
        required: true,
        trim: true,
    }, price: {
        type: Number,
        required: true,
        min: 0,
    }, category: {
        type: Schema.Types.ObjectId,
        ref: "CATEGORY",
        required: true,
    }, image: {
        type: String,
        required: true,
    }, searchTags: [
        {
            type: String,
            lowercase: true,
        },
    ], subCategory: {
        type: Schema.Types.ObjectId,
        ref: "SUB_CATEGORY",
        required: true,
    }, discount: {
        type: Number,
        default: 0,
    }, featured: Boolean, otherImage1: String, otherImage2: String, otherImage3: String, size: {
        type: Number,
        required: true,
    }, unit: {
        type: String,
        required: true,
    } }, easyCreated), { timestamps: true });
const productVariantSchema = new Schema(Object.assign({ type: {
        type: String,
        required: true,
        trim: true,
    }, size: {
        type: String,
        required: true,
        trim: true,
    }, price: {
        type: Number,
        required: true,
        min: 0,
    }, image: {
        type: String,
    }, productId: {
        type: Schema.Types.ObjectId,
        ref: "PRODUCT",
        required: true,
    } }, easyCreated), { timestamps: true });
export const PRODUCT_VARIANT = model("PRODUCT_VARIANT", productVariantSchema);
export const PRODUCT = model("PRODUCT", productSchema);
//# sourceMappingURL=model.product.js.map