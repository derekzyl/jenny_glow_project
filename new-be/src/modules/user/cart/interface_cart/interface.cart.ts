import { Document, Model, Types } from "mongoose";

export type CartItemI = {
  productId: Types.ObjectId;
  totalCount: number;
  totalPrice: number;
  shippingFee: number;
  variantId?: Types.ObjectId|undefined;
};
export interface CartI {
  userId: Types.ObjectId;
  cartItemsId:Types.ObjectId[]
  totalPrice: number;
  vat: number;
  subTotal: number;
  totalShippingFee: number;
}

export interface CartDocI extends Document, CartI {}
export interface CartModelI extends Model<CartDocI> {
  checkDefaultWishlist(): void;
}

export interface CartItemDocI extends CartItemI, Document {
  cartId: Types.ObjectId;
}
export type CartItemBodyT = CartItemI;
export type CartBodyT = Omit<CartI, "userId" | "cartItemsId">;
