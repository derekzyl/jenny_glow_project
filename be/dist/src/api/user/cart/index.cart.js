"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartIndex = void 0;
const controller_cart_1 = require("./main_cart/controller.cart");
class Cart {
    constructor() {
        this.add_cart = controller_cart_1.addCart;
        this.remove_cart = controller_cart_1.removeCart;
        this.get_cart = controller_cart_1.getCart;
    }
}
exports.CartIndex = new Cart();
