import {
  addCart,
  removeCart,
  getCart,
  updateCartWithAddress,
} from "./main_cart/controller.cart";

class Cart {
  public add_cart = addCart;
  public remove_cart = removeCart;
  public get_cart = getCart;
  public update_cart_with_address = updateCartWithAddress;
}
export const CartIndex = new Cart();
