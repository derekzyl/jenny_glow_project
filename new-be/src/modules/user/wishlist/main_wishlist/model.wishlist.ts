import { Schema, model } from "mongoose";
import {
  WishlistDocI,
  WishlistModelI,
} from "../interface_wishlist/interface.wishlist";

const wishlistSchema = new Schema<WishlistDocI, WishlistModelI>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "USERS" },
  productsId: [{ type: Schema.Types.ObjectId, required: true, ref: "PRODUCT" }],
});

export const WISHLIST = model("WISHLIST", wishlistSchema);
