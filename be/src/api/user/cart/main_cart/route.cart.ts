import { Router } from "express";
import { CartIndex } from "../index.cart";
import { AuthIndex } from "../../../auth/index.auth";

const cartRouter = Router();
cartRouter
  .route("/")

  .get(AuthIndex.protector, CartIndex.get_cart);
cartRouter.route("add/:id").patch(AuthIndex.protector, CartIndex.add_cart);
cartRouter
  .route("remove/:id")
  .patch(AuthIndex.protector, CartIndex.remove_cart);
export default cartRouter;
