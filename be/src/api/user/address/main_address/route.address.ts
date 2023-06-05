import { Router } from "express";
import { AddressIndex } from "../index.address";
import { AuthIndex } from "../../../auth/index.auth";
import { GeneralIndex } from "../../../general_factory/index.factory";
import { PermissionsE } from "../../../general_factory/interface/general_factory";

const addressRouter = Router();
addressRouter
  .route("/")
  .post(AuthIndex.protector, AddressIndex.createAddress)
  .get(AuthIndex.protector, AddressIndex.getAllAddress);
addressRouter
  .route("/:id")
  .patch(AuthIndex.protector, AddressIndex.updateAddress)
  .delete(AuthIndex.protector, AddressIndex.deleteAddress);
export default addressRouter;
