"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartIndex = void 0;
const controller_cart_1 = require("./main_cart/controller.cart");
class Cart {
    add_cart = controller_cart_1.addCart;
    remove_cart = controller_cart_1.removeCart;
    get_cart = controller_cart_1.getCart;
}
exports.CartIndex = new Cart();
