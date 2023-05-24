import { NextFunction, Response, Request } from "express";
import { Crud } from "../../../general_factory/crud";
import { VAT } from "./model.vat";

export const createVat = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body = request.body;

    const gotten_body = { ...body };
    const crud_vat = new Crud(request, response, next);
    crud_vat.create({ model: VAT, exempt: "" }, gotten_body, {
      name: gotten_body.name,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneVat = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_vat = new Crud(request, response, next);
  crud_vat.getOne(
    { model: VAT, exempt: "-__v -created_at updated_at" },
    { vat_name: request.params.id }
  );
};

export const getManyVat = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.getMany(
    { model: VAT, exempt: "-__v -created_at -updated_at" },
    request.query
  );
};

export const updateVat = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const body = request.body;
  const crud_review = new Crud(request, response, next);
  crud_review.update(
    { model: VAT, exempt: "-__v" },
    { vat_name: request.params.id },
    { ...body }
  );
};
export const deleteVat = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.delete(
    { model: VAT, exempt: "-__v -created_at -updated_at" },
    { vat_name: request.params.id }
  );
};
