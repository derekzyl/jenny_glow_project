import { Request, Response } from "express";

import { ADDRESS } from "./model.address";

import { ApiError } from "@modules/errors";
import { catchAsync } from "@modules/utils";
import { phoneRegex } from "@modules/utils/utils";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";
import {
  AddressBodyT,
  AddressI
} from "../interface_address/interface.address";

export const createAddress =catchAsync( async (
  request: Request,
  response: Response,

) => {

  

    const body: AddressBodyT = request.body;
    const regex_check = phoneRegex(body.phone);
    if (!regex_check) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid phone number");
    }

    // find the  user address length
    const get_addresses = await ADDRESS.find({ user: request.user.id });
    if (!get_addresses || get_addresses.length < 1) {
      body.isDefault = true;
    }
  const createAddress = CrudService.create<AddressI>({
    check: { user: request.user.id },
    data: {...body, userId: request.user.id},
    modelData: {
      Model: ADDRESS,
      select: ["-__v"],
    },
  });
  response.status(httpStatus.CREATED).send(createAddress);

});

export const getOneAddress =catchAsync( async (
  request: Request,
  response: Response,

) => {
  const getOne = await CrudService.getOne<AddressI>({
    modelData: {
      Model: ADDRESS,
      select: ["-__v"],

    }, data: { _id: request.params["id"] },
    populate:{}

  })
  response.json(getOne);
});

export const getManyAddress =catchAsync (async (
  request: Request,
  response: Response,

) => {
  const getMany = await CrudService.getMany<AddressI>({
    modelData: {
      Model: ADDRESS,
      select: ["-__v"],

    },
    query: request.query,filter:{},
    populate:{}
  });
  response.json(getMany);
});

export const updateAddress = catchAsync(async (
  request: Request,
  response: Response,

) => {

  const updateAddress = await CrudService.update<AddressI>({
    data: request.body,
    filter: { _id: request.params["id"] },
    modelData: {
      Model: ADDRESS,
      select: ["-__v"],

    },
  });
  response.json(updateAddress);

});
export const deleteAddress = catchAsync(async (
  request: Request,
  response: Response,

) => {
  const deleteAddress = await CrudService.delete<AddressI>({
    data: { _id: request.params["id"] },
    modelData: {
      Model: ADDRESS,
      select: ["-__v"],

    },
  });
  response.json(deleteAddress);

});


export const setDefaultAddress = catchAsync(async (
  request: Request,
  response: Response,

) => {
  const setDefaultAddress = await CrudService.update<AddressI>({
    data: { isDefault: true },
    filter: { _id: request.params["id"] },
    modelData: {
      Model: ADDRESS,
      select: ["-__v"],

    },
  });
  response.json(setDefaultAddress);

});


export const getAddressesByUser = catchAsync(async(
  request: Request,
  response: Response,

) => {
  const getMany = await CrudService.getMany<AddressI>({
    modelData: {
      Model: ADDRESS,
      select: ['-__v'],
    },
    query: request.query,
    filter: { userId: request.user.id },
    populate: {},
  });
  response.json(getMany);
})
export const getAddressByUser = catchAsync(async(
  request: Request,
  response: Response,

) => {
  const getOne = await CrudService.getOne<AddressI>({
    modelData: {
      Model: ADDRESS,
      select: ['-__v'],
    },
    data: { _id: request.params['id'], userId: request.user.id },

    populate: {},
  });
  response.json(getOne);
})
export const deleteAddressByUser = catchAsync(async(
  request: Request,
  response: Response,

) => {
  const deleteAddress = await CrudService.delete<AddressI>({
    data: { _id: request.params['id'], userId: request.user.id },
    modelData: {
      Model: ADDRESS,
      select: ['-__v'],
    },
  });
  response.json(deleteAddress);
})

export const updateAddressByUser = catchAsync(async(
  request: Request,
  response: Response,

) => {
  const updateAddress = await CrudService.update<AddressI>({
    data: request.body,
    filter: { _id: request.params['id'], userId: request.user.id },
    modelData: {
      Model: ADDRESS,
      select: ['-__v'],
    },
  });
  response.json(updateAddress);
})