import { addShippingFee, addStateShippingFee, deleteShippingFee, fetchCountryAndState, getAllShippingFee, getOneShippingFee, updateShippingFee, updateStateShippingFee } from "./main_shipping/controller.shipping";
class Shipping {
    constructor() {
        this.create_shipping = addShippingFee;
        this.get_all_shipping_fee = getAllShippingFee;
        this.get_one_shipping_fee = getOneShippingFee;
        this.update_shipping_fee = updateShippingFee;
        this.delete_shipping_fee = deleteShippingFee;
        this.fetch_country_and_state = fetchCountryAndState;
        this.add_state_shipping_fee = addStateShippingFee;
        this.update_state_shipping_fee = updateStateShippingFee;
    }
}
export const ShippingIndex = new Shipping();
//# sourceMappingURL=index.shipping.js.map