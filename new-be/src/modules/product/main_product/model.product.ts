import { easyCreated } from "@modules/utils/created";
import { Schema, model } from "mongoose";
import { ProductDocI, ProductVariantDocI } from "../interface_product/interface.product";

const productSchema = new Schema<ProductDocI>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
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

    category: {
      type: Schema.Types.ObjectId,
      ref: "CATEGORY",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  
    searchTags: [
      {
        type: String,
        lowercase: true,
      },
    ],
 
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SUB_CATEGORY",
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },
    featured: Boolean,
    otherImage1: String,
    otherImage2: String,
    otherImage3: String,
   size: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },...easyCreated
  },

  { timestamps: true }
);

const productVariantSchema = new Schema<ProductVariantDocI>(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
 
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "PRODUCT",
      required: true,
    },
    ...easyCreated
  },
  { timestamps: true }
);

export const PRODUCT_VARIANT = model<ProductVariantDocI>( "PRODUCT_VARIANT", productVariantSchema);
export const PRODUCT = model<ProductDocI>("PRODUCT", productSchema);
