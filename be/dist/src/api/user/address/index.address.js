"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressIndex = void 0;
const controller_address_1 = require("./main_address/controller.address");
class Address {
    constructor() {
        this.createAddress = controller_address_1.createAddress;
        this.getAllAddress = controller_address_1.getManyAddress;
        this.updateAddress = controller_address_1.updateAddress;
        this.deleteAddress = controller_address_1.deleteAddress;
    }
}
exports.AddressIndex = new Address();
