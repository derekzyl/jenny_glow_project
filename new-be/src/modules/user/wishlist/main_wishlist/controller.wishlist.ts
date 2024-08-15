import { Request, Response } from "express";

import { ApiError } from "@modules/errors";
import responseMessage from "@modules/genCrud/responseMessage";
import { catchAsync } from "@modules/utils";
import { CrudService } from "expressbolt";
import { Types } from "mongoose";
import { PRODUCT } from "../../../product/main_product/model.product";
import { WishlistI } from "../interface_wishlist/interface.wishlist";
import { WISHLIST } from "./model.wishlist";

//todo address receipt

export const addWishlist = catchAsync(async (
  request: Request,
  response: Response,
 
) => {
 
    const id = request.params['id'];
    const getProduct = await PRODUCT.findById(id);
    if (!getProduct) {
      throw new ApiError(404,"product not found sorry");
    }
    const user = request.user;
    let getWishList = await WISHLIST.findOne({ user: user.id });
    if (!getWishList) getWishList = await createWishList(user.id);


    const wishListP = new Set([...getWishList.productsId, getProduct.id]);
    getWishList.productsId = Array.from(wishListP);
    getWishList.save();

    return response.status(200).json(
      responseMessage({
        data: `${getProduct.name} added to wish list`,
        message: "added successfully",
        success_status: true,
      })
    );


});

export const removeWishlist = catchAsync(async (
  request: Request,
  response: Response,
 
) => {
  
    const id = request.params['id'];
    const getProduct = await PRODUCT.findById(id);
    if (!getProduct) {
      throw new ApiError(404,"product not found sorry");
    }
    const user = request.user;
    let getWishList = await WISHLIST.findOne({ user: user.id });
    if (!getWishList) getWishList = await createWishList(user.id);

    const wishListP = new Set([...getWishList.productsId]);
    wishListP.delete(getProduct.id);
    getWishList.productsId = Array.from(wishListP);
    getWishList.save();

    return response.status(200).json(
      responseMessage({
        data: `${getProduct.name} removed from wish list`,
        message: "removed successfully",
        success_status: true,
      })
    );

});

export const getWishlist = catchAsync(async (
  request: Request,
  response: Response,
 
) => {
  const getManyWishList = CrudService.getMany<WishlistI>(
    {
      filter: { userId: request.user.id }, modelData: {
        Model: WISHLIST, select:[]
      },
      populate: {
        path: 'productsId',
        
      },
      query:request.query
  }
  )
  response.status(200).json(getManyWishList)
});


export async function createWishList (userId: Types.ObjectId) {
  const wishList = await WISHLIST.create({ user: userId });
  return wishList;
}