import { NextFunction, Response, Request } from "express";

import { WISHLIST } from "./model.wishlist";
import { PRODUCT } from "../../../product/main_product/model.product";
import { APP_ERROR } from "../../../../utilities/custom_error";
import { HTTP_RESPONSE } from "../../../../utilities/http_response";
import { responseMessage } from "../../../../utilities/response_message";
import { Crud } from "../../../general_factory/crud";

//todo address receipt

export const addWishlist = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = request.params.id;
    const get_product = await PRODUCT.findById(id);
    if (!get_product) {
      throw APP_ERROR("product not found sorry", HTTP_RESPONSE.NOT_FOUND);
    }
    const user = request.user;
    let get_wish_list = await WISHLIST.findOne({ user: user.id });
    if (!get_wish_list) get_wish_list = await WISHLIST.create({ user: user });
    get_wish_list.products = get_wish_list.products.concat(get_product.id);
    get_wish_list.save();
    return response.status(HTTP_RESPONSE.OK).json(
      responseMessage({
        data: `${get_product.name} added successfully to wish list`,
        message: "added successfully",
        success_status: true,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const removeWishlist = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = request.params.id;
    const get_product = await PRODUCT.findById(id);
    if (!get_product) {
      throw APP_ERROR("product not found sorry", HTTP_RESPONSE.NOT_FOUND);
    }
    const user = request.user;
    const get_wish_list = await WISHLIST.findOne({ user: user.id }).populate(
      "products"
    );
    if (!get_wish_list)
      throw APP_ERROR("oops some error glitch here", HTTP_RESPONSE.FORBIDDEN);

    get_wish_list.products = get_wish_list?.products.filter(
      (product) => product.id !== get_product.id
    );
    get_wish_list.save();
    return response.status(HTTP_RESPONSE.OK).json(
      responseMessage({
        data: `${get_product.name} removed successfully from wish list`,
        message: "removed successfully",
        success_status: true,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const get_crud = new Crud(request, response, next);
    await get_crud.getMany(
      { model: WISHLIST, exempt: "-user" },
      request.query,
      { user: request.user.id },
      { model: "products" }
    );
  } catch (error) {
    next(error);
  }
};
