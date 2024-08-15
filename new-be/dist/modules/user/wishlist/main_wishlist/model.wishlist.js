import { Schema, model } from "mongoose";
const wishlistSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "USERS" },
    productsId: [{ type: Schema.Types.ObjectId, required: true, ref: "PRODUCT" }],
});
export const WISHLIST = model("WISHLIST", wishlistSchema);
//# sourceMappingURL=model.wishlist.js.map