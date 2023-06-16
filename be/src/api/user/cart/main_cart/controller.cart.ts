import { NextFunction, Response, Request } from "express";
import { Types } from "mongoose";

import { CART, CART_ITEM } from "./model.cart";
import { PRODUCT } from "../../../product/main_product/model.product";
import { APP_ERROR } from "../../../../utilities/custom_error";
import { HTTP_RESPONSE } from "../../../../utilities/http_response";
import { responseMessage } from "../../../../utilities/response_message";
import { Crud } from "../../../general_factory/crud";
import { ADDRESS } from "../../address/main_address/model.address";
import { VAT } from "../../../admin/vat/main_vat/model.vat";
import { VatE } from "../../../admin/vat/interface_vat/interface.vat";
import { SHIPPING } from "../../../admin/shipping/main_shipping/model.shipping";
import { CartDocI } from "../interface_cart/interface.cart";
import { calculateAddressFee } from "../../../sales/online/main_online/service.online";
import { n } from "../../../../utilities/number_checker";
import { networkInterfaces } from "os";

//todo address receipt

export const addCart = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // 1) get product with request parameters
    const id = request.params.id;
    const get_product = await PRODUCT.findById(id);
    if (!get_product) {
      throw APP_ERROR("product not found sorry", HTTP_RESPONSE.NOT_FOUND);
    }
    // 2) get user information
    const user = request.user.id;

    // 3) find cart information
    let total_price = 0;
    let sub_total = 0;
    let get_cart = await CART.findOne({ user: user.id });
    if (!get_cart) get_cart = await CART.create({ user: user });

    // 4) find default user address
    const find_user_default_address = await ADDRESS.findOne({
      user: user,
      is_default: true,
    });

    // 5) find shipping fee
    let total_shipping_fee = 0;
    const find_shipping_fee = await SHIPPING.findOne({
      country: find_user_default_address?.country,
    });

    //6) get state fee
    let state_fee: any;
    if (find_shipping_fee)
      state_fee = find_shipping_fee.states.find(
        (state) => state.name === find_user_default_address?.state
      );
    if (state_fee) state_fee = n(state_fee.state_shipping_fee);
    //7) get vat
    const find_vat = await VAT.findOne({ vat_name: VatE.ONLINE });
    if (!find_vat) ""; /*throw  APP_ERROR(" vat is not found")*/

    //8) find product in cart
    const cart_item = await CART_ITEM.findOne({
      product: get_product.id,
      cart_id: get_cart.id,
    });

    if (cart_item) {
      cart_item.product_total_count = cart_item.product_total_count + 1;
      cart_item.product_total_price += get_product.discount_percentage
        ? n(get_product.price) -
          (n(get_product.price) * n(get_product.discount_percentage)) / 100
        : n(get_product.price);

      cart_item.shipping_fee =
        find_user_default_address && find_shipping_fee
          ? n(cart_item.product_total_count) * n(state_fee)
          : 0;

      const total_product_price =
        find_user_default_address && find_shipping_fee
          ? n(cart_item.shipping_fee) + n(cart_item.product_total_price)
          : n(cart_item.product_total_price);
      sub_total += cart_item.product_total_price;
      total_price += total_product_price;
      cart_item.save();
    } else {
      const create_new_cart_item = new CART_ITEM({
        product: get_product.id,
        product_total_count: 1,
        product_total_price: get_product.discount_percentage
          ? get_product.price -
            (get_product.price * get_product.discount_percentage) / 100
          : get_product.price,
        shipping_fee:
          find_user_default_address && find_shipping_fee ? state_fee : 0,
        cart_id: get_cart.id,
      });

      const get_cart_item = await create_new_cart_item.save();
      total_shipping_fee =
        find_user_default_address && find_shipping_fee
          ? get_cart_item.shipping_fee
          : 0;
      total_price =
        find_user_default_address && find_shipping_fee
          ? get_cart_item.product_total_price + get_cart_item.shipping_fee
          : get_cart_item.product_total_price;
      sub_total += get_cart_item.product_total_price;
      get_cart.products.push(get_cart_item.id);
    }
    const get_vat = await VAT.findOne({ vat_name: VatE.ONLINE });

    get_cart.total_price += get_vat?.vat_percentage
      ? total_price + (sub_total * Number(get_vat.vat_percentage)) / 100
      : total_price;
    get_cart.total_shipping_fee += total_shipping_fee;
    get_cart.sub_total += sub_total;
    get_cart.vat += get_vat?.vat_percentage
      ? (n(sub_total) * n(get_vat?.vat_percentage)) / 100
      : 0;

    get_cart.save();

    return response.status(HTTP_RESPONSE.OK).json(
      responseMessage({
        data: `${get_product.name} added successfully to cart ${
          find_user_default_address && find_shipping_fee
            ? ""
            : "add your address before checkout because address missing"
        }`,
        message: "added successfully",
        success_status: true,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const removeCart = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // 1) get product with request parameters
    const id = request.params.id;
    const get_product = await PRODUCT.findById(id);
    if (!get_product) {
      throw APP_ERROR("product not found sorry", HTTP_RESPONSE.NOT_FOUND);
    }
    // 2) get user information
    const user = request.user.id;

    // 3) find cart information
    let total_price = 0;
    let sub_total = 0;
    let get_cart = await CART.findOne({ user: user.id });
    if (!get_cart) get_cart = await CART.create({ user: user });

    // 4) find default user address
    const find_user_default_address = await ADDRESS.findOne({
      user: user,
      is_default: true,
    });

    // 5) find shipping fee
    let total_shipping_fee = 0;
    const find_shipping_fee = await SHIPPING.findOne({
      country: find_user_default_address?.country,
    });

    //6) get state fee
    let state_fee: any;
    if (find_shipping_fee)
      state_fee = find_shipping_fee.states.find(
        (state) => state.name === find_user_default_address?.state
      );
    if (state_fee) state_fee = state_fee.state_shipping_fee;
    //7) get vat
    const find_vat = await VAT.findOne({ vat_name: VatE.ONLINE });
    if (!find_vat) ""; /*throw  APP_ERROR(" vat is not found")*/

    //8) find product in cart

    //8) find product in cart
    const cart_item = await CART_ITEM.findOne({
      product: get_product.id,
      cart_id: get_cart.id,
    });
    if (!cart_item)
      throw APP_ERROR("hi developer you arent handling this well");
    if (cart_item?.product_total_count > 1) {
      cart_item.product_total_count = cart_item.product_total_count - 1;
      cart_item.product_total_price -= get_product.discount_percentage
        ? n(get_product.price) +
          (n(get_product.price) * get_product.discount_percentage) / 100
        : n(get_product.price);
      cart_item.shipping_fee =
        find_user_default_address && find_shipping_fee
          ? cart_item.product_total_count * state_fee
          : 0;

      const total_product_price =
        find_user_default_address && find_shipping_fee
          ? cart_item.shipping_fee + cart_item.product_total_price
          : cart_item.product_total_price;
      total_price = total_product_price;
      sub_total = cart_item.product_total_price;
      cart_item.save();
    } else {
      total_shipping_fee -=
        find_user_default_address && find_shipping_fee
          ? cart_item.shipping_fee
          : 0;
      total_price =
        find_user_default_address && find_shipping_fee
          ? cart_item.product_total_price + cart_item.shipping_fee
          : cart_item.product_total_price;
      sub_total = cart_item.product_total_price;
      const find_product_index = get_cart.products.findIndex(
        (p) => p.id === get_product.id
      );
      get_cart.products.splice(find_product_index, 1);
    }
    get_cart.total_price -= total_price;
    get_cart.total_shipping_fee -= total_shipping_fee;
    get_cart.sub_total -= sub_total;
    get_cart.vat = find_vat?.vat_percentage
      ? (n(total_price) * n(find_vat?.vat_percentage)) / 100
      : 0;
    get_cart.save();

    return response.status(HTTP_RESPONSE.OK).json(
      responseMessage({
        data: `${get_product.name} removed successfully from cart ${
          find_user_default_address && find_shipping_fee
            ? ""
            : "add your address before checkout because address missing"
        }`,
        message: "added successfully",
        success_status: true,
      })
    );
  } catch (error) {
    next(error);
  }
};
export const getCart = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const get_crud = new Crud(request, response, next);
    await get_crud.getOne<CartDocI>(
      { model: CART, exempt: "-user" },
      { user: request.user.id },
      { model: "products" }
    );
  } catch (error) {
    next(error);
  }
};

export const updateCartWithAddress = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const get_cart = await CART.findOne({ user: request.user.id });
    if (!get_cart)
      throw APP_ERROR(
        "Cart not found developer error",
        HTTP_RESPONSE.BAD_REQUEST
      );

    const get_address_id = request.params.address_id;

    const get_address = await ADDRESS.findById(get_address_id);
    if (!get_address)
      throw APP_ERROR(
        "Address not found developer error",
        HTTP_RESPONSE.BAD_REQUEST
      );
    let total_price = 0;
    let total_shipping_fee = 0;

    const get_cart_items = await CART_ITEM.find({
      cart_id: get_cart.id,
    });
    if (get_cart_items.length > 0) {
      const get_shipping_fee = await calculateAddressFee(get_address.id);

      for (const cart_item of get_cart_items) {
        const get_cart_item = await CART_ITEM.findById(cart_item.id);
        if (!get_cart_item) throw APP_ERROR("Cart item not found");
        const find_and_update_cart_item = await CART_ITEM.findByIdAndUpdate(
          cart_item.id,
          {
            shipping_fee: get_shipping_fee * get_cart_item.product_total_count,
          }
        );
        if (find_and_update_cart_item) {
          const calculate_total =
            find_and_update_cart_item?.shipping_fee +
            find_and_update_cart_item?.product_total_price;
          total_price += calculate_total;
          total_shipping_fee += find_and_update_cart_item.shipping_fee;
        }
      }
      get_cart.total_price = total_price;
      get_cart.total_shipping_fee = total_shipping_fee;
      get_cart.save();
    }
  } catch (error) {
    next(error);
  }
};
