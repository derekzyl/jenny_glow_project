import { auth } from "../../../auth";
import { allPermissions } from "../../../setting/roles";
import { validate } from "../../../validate";
import { Router } from "express";
import { ShippingIndex } from "../../../admin/shipping/index.shipping";
import { AddressIndex } from "../index.address";
import * as addressValidation from "./validation.address";
const addressRouter = Router();
addressRouter
    .route("/")
    .post(auth(), validate(addressValidation.addressSchema), AddressIndex.createAddress)
    .get(auth(allPermissions.User.Manage), validate(addressValidation.addressQuerySchema), AddressIndex.getAllAddress);
addressRouter
    .route("/:id/address")
    .get(auth(allPermissions.User.Manage), AddressIndex.getOneAddress)
    .patch(auth(allPermissions.User.Manage), AddressIndex.updateAddress)
    .delete(auth(allPermissions.User.Manage), AddressIndex.deleteAddress);
addressRouter
    .route("/getCountryAndState")
    .get(auth(), ShippingIndex.fetch_country_and_state);
addressRouter
    .route("/getAddressByUser")
    .get(auth(), AddressIndex.getAddressByUser);
addressRouter.get("/getAddressesByUser", auth(), AddressIndex.getAddressesByUser);
addressRouter.patch("/setDefaultAddress/:id", auth(), AddressIndex.setDefaultAddress);
export default addressRouter;
//# sourceMappingURL=route.address.js.map