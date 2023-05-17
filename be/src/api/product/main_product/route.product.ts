import { Router } from "express";

import { AuthIndex } from "../../auth/index.auth";

import { ProductIndex } from "../index.product";

const productRouter = Router();

productRouter
  .route("/")
  .post(AuthIndex.protector, ProductIndex.create_product)
  .get(AuthIndex.protector, ProductIndex.get_all_product);
productRouter
  .route("/:id")
  .get(
    AuthIndex.protector,

    ProductIndex.get_one_product
  )
  .patch(AuthIndex.protector, ProductIndex.update_product)
  .delete(AuthIndex.protector, ProductIndex.delete_product);

export default productRouter;
