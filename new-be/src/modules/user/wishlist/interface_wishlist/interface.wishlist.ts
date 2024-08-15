import { Document, Model, Types } from "mongoose";

export interface WishlistI {
  userId: Types.ObjectId;
  productsId: Types.ObjectId[];
}

export interface WishlistDocI extends Document, WishlistI {}
export interface WishlistModelI extends Model<WishlistDocI> {
  checkDefaultWishlist(): void;
}

export type WishlistBodyT = Omit<WishlistI, "userId">;
