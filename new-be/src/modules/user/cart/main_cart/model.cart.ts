import { Schema, model } from "mongoose";
import {
  CartDocI,
  CartItemDocI,
  CartModelI,
} from "../interface_cart/interface.cart";

const cartSchema = new Schema<CartDocI, CartModelI>(
  {
    userId: { type: Schema.Types.ObjectId,unique:true, required: true, ref: "USERS" },
    cartItemsId: [{ type: Schema.Types.ObjectId, ref: "CART_ITEM" }],
    subTotal: { type: Number },

    totalShippingFee: {
      type:Number
    }, totalPrice: {
      type:Number, default:0
    },
    vat: { type: Number },

  },
  { timestamps: true}
);

const cartItemSchema = new Schema<CartItemDocI>({
  productId: { type: Schema.Types.ObjectId, ref: "PRODUCT", required: true },
  cartId: { type: Schema.Types.ObjectId, ref: "CART", required: true },
  totalCount: Number,
  totalPrice: Number,
  shippingFee: Number,

}, {
  timestamps:true
});
export const CART_ITEM = model("CART_ITEM", cartItemSchema);
export const CART = model("CART", cartSchema);
