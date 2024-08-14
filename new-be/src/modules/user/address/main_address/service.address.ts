import { ADDRESS } from "./model.address";

import { ApiError } from "@modules/errors";

import { phoneRegex } from "@modules/utils/utils";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { AddressBodyT } from "../interface_address/interface.address";


export async function createAddress(body: AddressBodyT, userId:Types.ObjectId) {
  const regex_check = phoneRegex(body.phone);
  if (!regex_check) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid phone number");
  }

  // find the  user address length
  const get_addresses = await ADDRESS.find({ user: userId });
  if (!get_addresses || get_addresses.length < 1) {
    body.isDefault = true;
  }
  const create_address = await ADDRESS.create({ ...body, user: userId });
  return create_address;
}


export async function getUserDefaultAddress(userId: Types.ObjectId) {
  const getOne = await ADDRESS.findOne({ user: userId, isDefault: true });
  return getOne;
}
export async function getOneAddressById (id: Types.ObjectId) {
  const getOne = await ADDRESS.findById(id);
  return getOne;
}