import { addCart, removeCart, getCart } from "./main_cart/controller.cart";

class Cart {
  public add_cart = addCart;
  public remove_cart = removeCart;
  public get_cart = getCart;
}
export const CartIndex = new Cart();
