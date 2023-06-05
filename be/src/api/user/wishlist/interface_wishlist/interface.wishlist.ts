import { Types, Document, Model } from "mongoose";
import { ProductI } from "../../../product/interface_product/interface.product";

export interface WishlistI {
  user: Types.ObjectId;
  products: ProductI[];
}

export interface WishlistDocI extends Document, WishlistI {}
export interface WishlistModelI extends Model<WishlistDocI> {
  checkDefaultWishlist(): void;
}

export type WishlistBodyT = Omit<WishlistI, "user">;
