import { auth } from "../../../auth";
import { allPermissions } from "../../../setting/roles";
import { validate } from "../../../validate";
import { Router } from "express";
import { ShippingIndex } from "../index.shipping";
import * as shippingValidation from './validation.shipping';
const shippingRouter = Router();
shippingRouter
    .route('/')
    .post(auth(allPermissions.Shipping.Create, allPermissions.Shipping.Manage), validate(shippingValidation.addShippingFee), ShippingIndex.create_shipping)
    .get(auth(allPermissions.Shipping.GetAll, allPermissions.Shipping.Manage), validate(shippingValidation.getAllShippingFee), ShippingIndex.get_all_shipping_fee);
shippingRouter
    .route("/:id")
    .patch(auth(allPermissions.Shipping.Update, allPermissions.Shipping.Manage), validate(shippingValidation.updateShippingFee), ShippingIndex.update_shipping_fee)
    .delete(auth(allPermissions.Shipping.Delete, allPermissions.Shipping.Manage), validate(shippingValidation.deleteShippingFee), ShippingIndex.delete_shipping_fee)
    .get(auth(allPermissions.Shipping.Get, allPermissions.Shipping.Manage), validate(shippingValidation.getOneShippingFee), ShippingIndex.get_one_shipping_fee);
shippingRouter
    .route("/fetch/all-countries")
    .get(auth(allPermissions.Shipping.Get, allPermissions.Shipping.Manage), ShippingIndex.fetch_country_and_state);
shippingRouter
    .route("state/add-state-shipping-fee")
    .post(auth(allPermissions.Shipping.Create, allPermissions.Shipping.Manage), validate(shippingValidation.addStateShippingFee), ShippingIndex.add_state_shipping_fee)
    .patch(auth(allPermissions.Shipping.Update, allPermissions.Shipping.Manage), validate(shippingValidation.updateStateShippingFee), ShippingIndex.update_state_shipping_fee);
export default shippingRouter;
//# sourceMappingURL=route.role.js.map