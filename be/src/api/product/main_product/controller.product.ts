import { NextFunction, Response, Request } from "express";
import { ProductBodyI, ProductI } from "../interface_product/product";
import { Crud } from "../../general_factory/crud";
import { PRODUCT } from "./model.product";

export const createProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  //todo: send the images to aws or cloudinary
  try {
    const body: ProductBodyI = request.body;

    const gotten_body = { ...body, created_by: request.user.id };
    const crud_product = new Crud(request, response, next);
    crud_product.create({ model: PRODUCT, exempt: "" }, gotten_body, {
      name: gotten_body.name,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_product = new Crud(request, response, next);
  crud_product.getOne(
    { model: PRODUCT, exempt: "-__v" },
    { id: request.params.id }
  );
};

export const getManyProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.getMany(
    { model: PRODUCT, exempt: "-__v -created_at -updated_at" },
    request.query
  );
};

export const updateProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const body = request.body;
  const crud_review = new Crud(request, response, next);
  crud_review.update(
    { model: PRODUCT, exempt: "-__v" },
    { id: request.params.id },
    { ...body }
  );
};
export const deleteProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.delete(
    { model: PRODUCT, exempt: "-__v" },
    { id: request.params.id }
  );
};
