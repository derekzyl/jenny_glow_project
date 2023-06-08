import { NextFunction, Response, Request } from "express";

import { ADDRESS } from "./model.address";

import { AddressBodyT } from "../interface_address/interface.address";
import { Crud } from "../../../general_factory/crud";
import { checkPermissions } from "../../../general_factory/permission_handler";
import { PermissionsE } from "../../../general_factory/interface/general_factory";

//todo address receipt

export const createAddress = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;

    const body: AddressBodyT = request.body;

    const crud_address = new Crud(request, response, next);
    crud_address.create(
      { model: ADDRESS, exempt: "" },
      { ...body, user: user.id },
      {}
    );
  } catch (error) {
    next(error);
  }
};

export const getOneAddress = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const check_user_clearance = checkPermissions(
    PermissionsE.VIEW_USER_PROFILE,
    request.user
  );
  const user = check_user_clearance ? undefined : request.user.id;
  const crud_address = new Crud(request, response, next);
  crud_address.getOne(
    { model: ADDRESS, exempt: "-__v -user " },
    { id: request.params.id, user },
    {}
  );
};

export const getManyAddress = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.getMany(
    { model: ADDRESS, exempt: "-__v, -user " },
    request.query,
    {},
    {}
  );
};

export const updateAddress = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const body = request.body;
  const crud_review = new Crud(request, response, next);
  crud_review.update(
    { model: ADDRESS, exempt: "-__v" },
    { id: request.params.id },
    { ...body }
  );
};
export const deleteAddress = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.delete(
    { model: ADDRESS, exempt: "-__v -created_at -updated_at" },
    { id: request.params.id }
  );
};
