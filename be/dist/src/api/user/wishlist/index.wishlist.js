"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistIndex = void 0;
const controller_wishlist_1 = require("./main_wishlist/controller.wishlist");
class Wishlist {
    constructor() {
        this.add_wishlist = controller_wishlist_1.addWishlist;
        this.remove_wishlist = controller_wishlist_1.removeWishlist;
        this.get_wishlist = controller_wishlist_1.getWishlist;
    }
}
exports.WishlistIndex = new Wishlist();
