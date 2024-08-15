import { addWishlist, removeWishlist, getWishlist, } from "./main_wishlist/controller.wishlist";
class Wishlist {
    constructor() {
        this.add_wishlist = addWishlist;
        this.remove_wishlist = removeWishlist;
        this.get_wishlist = getWishlist;
    }
}
export const WishlistIndex = new Wishlist();
//# sourceMappingURL=index.wishlist.js.map