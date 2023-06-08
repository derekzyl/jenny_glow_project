"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingIndex = void 0;
const controller_shipping_1 = require("./main_shipping/controller.shipping");
class Shipping {
    constructor() {
        this.create_shipping = controller_shipping_1.addShippingFee;
        this.get_all_shipping_fee = controller_shipping_1.getAllShippingFee;
        this.get_one_shipping_fee = controller_shipping_1.getOneShippingFee;
        this.update_shipping_fee = controller_shipping_1.updateShippingFee;
        this.delete_shipping_fee = controller_shipping_1.deleteShippingFee;
        this.fetch_country_and_state = controller_shipping_1.fetchCountryAndState;
    }
}
exports.ShippingIndex = new Shipping();
