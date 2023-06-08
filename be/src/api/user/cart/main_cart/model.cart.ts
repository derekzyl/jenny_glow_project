import { Schema, model } from "mongoose";
import { CartDocI, CartModelI } from "../interface_cart/interface.cart";
import { time_stamps } from "../../../general_factory/interface/general_factory";

const cartSchema = new Schema<CartDocI, CartModelI>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "USER" },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "PRODUCT",
        },
        product_total_count: { type: Number },
        product_total_price: { type: Number },
        shipping_fee: { type: Number },
      },
    ],
    sub_total: { type: Number },
    total_shipping_fee: { type: Number },
    vat: { type: Number },
    total_price: { type: Number },
  },
  { timestamps: time_stamps }
);

export const CART = model("CART", cartSchema);
