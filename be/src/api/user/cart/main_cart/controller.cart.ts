import { NextFunction, Response, Request } from "express";

import { CART } from "./model.cart";
import { PRODUCT } from "../../../product/main_product/model.product";
import { APP_ERROR } from "../../../../utilities/custom_error";
import { HTTP_RESPONSE } from "../../../../utilities/http_response";
import { responseMessage } from "../../../../utilities/response_message";
import { Crud } from "../../../general_factory/crud";
import { ADDRESS } from "../../address/main_address/model.address";
import { VAT } from "../../../admin/vat/main_vat/model.vat";
import { VatE } from "../../../admin/vat/interface_vat/interface.vat";
import { SHIPPING } from "../../../admin/shipping/main_shipping/model.shipping";
import { ProductAndCount } from "../interface_cart/interface.cart";

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
    const find_product_in_cart = get_cart.products.find(
      (product) => product.product.id === get_product.id
    );
    if (find_product_in_cart) {
      get_cart.products
        .filter((product) => product.product.id === get_product.id)
        .map((product) => {
          product.product_total_count += 1;
          product.product_total_price += get_product.discount_percentage
            ? get_product.price -
              (get_product.price * get_product.discount_percentage) / 100
            : get_product.price;
          product.shipping_fee = product.product_total_count * state_fee;
          const total_product_price =
            product.shipping_fee + product.product_total_price;
          total_shipping_fee += product.shipping_fee;
          total_price += total_product_price;
        });
    } else {
      const product: ProductAndCount = {
        product: get_product.id,
        product_total_count: 1,
        product_total_price: get_product.discount_percentage
          ? get_product.price -
            (get_product.price * get_product.discount_percentage) / 100
          : get_product.price,
        shipping_fee: state_fee,
      };
      total_shipping_fee += product.shipping_fee;
      total_price += product.product_total_price + product.shipping_fee;
    }
    get_cart.total_price = total_price;
    get_cart.total_shipping_fee = total_shipping_fee;
    get_cart.save();

    return response.status(HTTP_RESPONSE.OK).json(
      responseMessage({
        data: `${get_product.name} added successfully to cart`,
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
    let get_cart = await CART.findOne({ user: user.id });
    if (!get_cart) get_cart = await CART.create({ user: user });

    // 4) find default user address
    const find_user_default_address = await ADDRESS.findOne({
      user: user,
      is_default: true,
    });

    // 5) find shipping fee
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
    const find_product_in_cart = get_cart.products.find(
      (product) => product.product.id === get_product.id
    );
    if (find_product_in_cart && find_product_in_cart.product_total_count <= 1) {
      const get_item_index = get_cart.products.findIndex(
        (p) => p.product.id === get_product.id
      );
      get_cart.products.splice(get_item_index, 1);
    }

    if (find_product_in_cart && find_product_in_cart.product_total_count > 1) {
      get_cart.products
        .filter((product) => product.product.id === get_product.id)
        .map((product) => {
          product.product_total_count -= 1;
          product.product_total_price -= get_product.discount_percentage
            ? get_product.price -
              (get_product.price * get_product.discount_percentage) / 100
            : get_product.price;
          product.shipping_fee = product.product_total_count * state_fee;
        });
    } else {
      const product: ProductAndCount = {
        product: get_product.id,
        product_total_count: 1,
        product_total_price: get_product.discount_percentage
          ? get_product.price -
            (get_product.price * get_product.discount_percentage) / 100
          : get_product.price,
        shipping_fee: state_fee,
      };

      get_cart.products.push(product);
    }
    get_cart.save();

    return response.status(HTTP_RESPONSE.OK).json(
      responseMessage({
        data: `${get_product.name} added successfully to cart`,
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
    await get_crud.getOne(
      { model: CART, exempt: "-user" },
      { user: request.user.id },
      { model: "products" }
    );
  } catch (error) {
    next(error);
  }
};
