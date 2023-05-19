import { NextFunction, Response, Request } from "express";
import { Crud } from "../../../general_factory/crud";
import { POS } from "./model.pos";
import { BRANCH } from "../../../admin/branch/main_branch/model.branch";
import { STAFF } from "../../../admin/staff/main_staff/model.staff";
import path from "path";
import { HTTP_RESPONSE } from "../../../../utilities/http_response";
import { responseMessage } from "../../../../utilities/response_message";
import { generateId } from "../../../../utilities/id_generator";

// todo: get products for pos

export const createPos = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const order_id = generateId();
    const body = request.body;

    const get_staff = await STAFF.findOne({ user: request.user.id });
    const get_branch = await BRANCH.findOne({
      id: get_staff?.branch.id,
    });
  } catch (error) {
    next(error);
  }
};

export const getOnePos = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_pos = new Crud(request, response, next);
  crud_pos.getOne(
    { model: POS, exempt: "-__v -created_at updated_at" },
    { id: request.params.id }
  );
};

export const getManyPos = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_pos = new Crud(request, response, next);
  crud_pos.getMany(
    { model: POS, exempt: "-__v -created_at -updated_at" },
    request.query,
    {}
  );
};

export const getManyPosProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const get_staff = await STAFF.findOne({ user: request.user.id });
    const get_branch = await BRANCH.findOne({
      id: get_staff?.branch.id,
    }).populate({ path: "PRODUCT", match: { name: request.query.name } });
    let get_branch_product = get_branch?.product;
    if (get_branch_product) {
      get_branch_product = get_branch_product.filter(
        (product) => product.amount_in_stock > 0
      );
    }

    return response.status(HTTP_RESPONSE.OK).json(
      responseMessage({
        data: get_branch_product,
        message: "data fetched successfully",
        success_status: true,
        doc_length: get_branch_product?.length,
      })
    );
  } catch (error) {
    return response.status(HTTP_RESPONSE.BAD_REQUEST).json(
      responseMessage({
        data: error,
        message: "data fetched not fetched",
        success_status: false,
      })
    );
  }
};

export const updatePos = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const body = request.body;
  const crud_pos = new Crud(request, response, next);
  crud_pos.update(
    { model: POS, exempt: "-__v" },
    { id: request.params.id },
    { ...body }
  );
};
export const deletePos = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_pos = new Crud(request, response, next);
  crud_pos.delete(
    { model: POS, exempt: "-__v -created_at -updated_at" },
    { IDBCursorWithValue: request.params.id }
  );
};
