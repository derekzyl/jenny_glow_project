import { auth } from "@modules/auth";
import { Router } from "express";
import { WishlistIndex } from "../index.wishlist";

const wishlistRouter = Router();
wishlistRouter
  .route("/")

  .get(auth(), WishlistIndex.get_wishlist);
wishlistRouter
  .route("/add/:id")
  .post(auth(), WishlistIndex.add_wishlist);
wishlistRouter
  .route("/remove/:id")
  .patch(auth(), WishlistIndex.remove_wishlist);
export default wishlistRouter;
