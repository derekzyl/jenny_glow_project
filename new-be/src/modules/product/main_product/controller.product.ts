import { catchAsync } from "@modules/utils";
import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  ProductBodyI
} from "../interface_product/interface.product";
import * as productServices from "./service.product";
export const createProduct = catchAsync(async (
  request: Request,
  response: Response,
) => {
  //todo: send the images to aws or cloudinary

    const body: ProductBodyI = request.body;

    const createProduct = await productServices.createProduct({...body, createdBy: request.user._id, updatedBy: request.user._id});

    response.status(201).json(createProduct);
});

export const getOneProduct = catchAsync(async (
  request: Request,
  response: Response,

) => {
const getOne = await productServices.getOneProduct(new Types.ObjectId(request.params["id"]!));

response.json(getOne);
});

export const getManyProduct = catchAsync(async (
  request: Request,
  response: Response,

) => {
  const getMany = await productServices.getManyProduct(request.query);

  response.json(getMany);
});

export const updateProduct =catchAsync( async (
  request: Request,
  response: Response,

) => {
  const body: ProductBodyI = request.body;
  const updateProduct = await productServices.updateProduct(new Types.ObjectId(request.params["id"]!),{...body, updatedBy: request.user._id});

  response.json(updateProduct);
});
export const deleteProduct = catchAsync(async (
  request: Request,
  response: Response,

) => {
  const deleteProduct = await productServices.deleteProduct(new Types.ObjectId(request.params["id"]!));

  response.json(deleteProduct);
});

export const createProductVariant = catchAsync(async (
  request: Request,
  response: Response,

) => {
  const createProductVariant = await productServices.createProductVariant(request.body);

  response.status(201).json(createProductVariant);
});

export const getOneProductVariant = catchAsync(async (
  request: Request,
  response: Response,

) => {
  const getOne = await productServices.getOneProductVariant(new Types.ObjectId(request.params["id"]!));

  response.json(getOne);
});

export const getManyProductVariant = catchAsync(async (
  request: Request,
  response: Response,

) => {
  const getMany = await productServices.getManyProductVariant(request.query);

  response.json(getMany);
});

export const updateProductVariant = catchAsync(async (
  request: Request,
  response: Response,

) => {
  const body = request.body;
  const updateProductVariant = await productServices.updateProductVariant(new Types.ObjectId(request.params["id"]!),{...body, updatedBy: request.user._id});

  response.json(updateProductVariant);
});

export const deleteProductVariant = catchAsync(async (
  request: Request,
  response: Response,

) => {
  const deleteProductVariant = await productServices.deleteProductVariant(new Types.ObjectId(request.params["id"]!));

  response.json(deleteProductVariant);
});



   