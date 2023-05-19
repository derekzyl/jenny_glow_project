import { Schema, model } from "mongoose";
import { ProductI } from "../interface_product/product";
import { time_stamps } from "../../general_factory/interface/general_factory";

const productSchema = new Schema<ProductI>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    number_in_stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "CATEGORY",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    tags: [String],
    number_of_reviews: {
      type: Number,
    },
    sub_category: {
      type: Schema.Types.ObjectId,
      ref: "SUB_CATEGORY",
      required: true,
    },
    other_image: [String],
    weight: {
      type: Number,
      required: true,
    },
    featured: Boolean,
    available: Boolean,
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: "REVIEW",
      },
    ],
  },
  { timestamps: time_stamps }
);

export const PRODUCT = model<ProductI>("PRODUCT", productSchema);