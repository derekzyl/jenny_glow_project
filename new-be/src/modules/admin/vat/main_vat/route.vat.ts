import { Router } from "express";

import { VatIndex } from "../index.vat";

import { auth } from "@modules/auth";

const vatRouter = Router();

vatRouter
  .route("/")
  .post(
    auth(),
 
    VatIndex.create_vat
  )
  .get(
    auth(),
 
    VatIndex.get_all_vat
  );
vatRouter
  .route("/:id")
  .get(
    auth(),


    VatIndex.get_one_vat
  )
  .patch(
    auth(),

    VatIndex.update_vat
  )
  .delete(
    auth(),

    VatIndex.delete_vat
  );

export default vatRouter;
