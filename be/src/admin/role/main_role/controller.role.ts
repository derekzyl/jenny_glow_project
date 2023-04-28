import { Request, Response } from "express";
import { RoleI } from "../interface_role/role";
import { APP_ERROR } from "../../../utilities/custom_error";
import { HTTP_RESPONSE } from "../../../utilities/http_response";
import { ROLE } from "./model.role";
import { responseMessage } from "../../../utilities/response_message";

export const createRole = async (request: Request, response: Response) => {
  let { name }: RoleI = request.body;
  try {
    name = name.toUpperCase();
    const name_regex = /^[A-Z]{3,}$/g;
    if (!name_regex.test(name)) {
      throw APP_ERROR(
        "please check the role name and use another name",
        HTTP_RESPONSE.FORBIDDEN
      );
    }
    if (name === "ADMIN" || name === "admin") {
      throw APP_ERROR(
        "you cant add the name admin, oops",
        HTTP_RESPONSE.FORBIDDEN
      );
    }
    const create_role = new ROLE({ name });
    const role_created = create_role.save();
    response
      .status(HTTP_RESPONSE.CREATED)
      .json(responseMessage("role created successfully", true, role_created));
  } catch (error) {
    response
      .status(HTTP_RESPONSE.BAD_REQUEST)
      .json(responseMessage("role created successfully", false, error));
  }
};

export const getAllRole = async (request: Request, response: Response) => {
  try {
    const get_all_role = await ROLE.find();
    response
      .status(HTTP_RESPONSE.OK)
      .json(responseMessage("role created successfully", true, get_all_role));
  } catch (error) {
    response
      .status(HTTP_RESPONSE.BAD_REQUEST)
      .json(responseMessage("role created successfully", false, error));
  }
};

export const updateOneRole = async (request: Request, response: Response) => {
  const { role_id } = request.params;
  const { name } = request.body;

  try {
    const get_one_role = await ROLE.findById({ role_id });
    if (!get_one_role)
      throw APP_ERROR(
        "the role id is not in the database",
        HTTP_RESPONSE.BAD_REQUEST
      );
    const updated_role = await ROLE.findByIdAndUpdate(role_id, name);
    response
      .status(HTTP_RESPONSE.OK)
      .json(responseMessage("role created successfully", true, updated_role));
  } catch (error) {
    response
      .status(HTTP_RESPONSE.BAD_REQUEST)
      .json(responseMessage("role created successfully", false, error));
  }
};

export const deleteOneRole = async (request: Request, response: Response) => {
  const { role_id } = request.params;

  try {
    const get_one_role = await ROLE.findById({ role_id });
    if (!get_one_role)
      throw APP_ERROR(
        "the role id is not in the database",
        HTTP_RESPONSE.BAD_REQUEST
      );
    const deleted_role = await ROLE.findByIdAndDelete(role_id);
    response
      .status(HTTP_RESPONSE.OK)
      .json(responseMessage("role created successfully", true, deleted_role));
  } catch (error) {
    response
      .status(HTTP_RESPONSE.BAD_REQUEST)
      .json(responseMessage("role created successfully", false, error));
  }
};
