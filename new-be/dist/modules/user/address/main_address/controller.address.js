import { ADDRESS } from "./model.address";
import { ApiError } from "../../../errors";
import { catchAsync } from "../../../utils";
import { phoneRegex } from "../../../utils/utils";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";
export const createAddress = catchAsync(async (request, response) => {
    const body = request.body;
    const regex_check = phoneRegex(body.phone);
    if (!regex_check) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid phone number");
    }
    // find the  user address length
    const get_addresses = await ADDRESS.find({ user: request.user.id });
    if (!get_addresses || get_addresses.length < 1) {
        body.isDefault = true;
    }
    const createAddress = CrudService.create({
        check: { user: request.user.id },
        data: Object.assign(Object.assign({}, body), { userId: request.user.id }),
        modelData: {
            Model: ADDRESS,
            select: ["-__v"],
        },
    });
    response.status(httpStatus.CREATED).send(createAddress);
});
export const getOneAddress = catchAsync(async (request, response) => {
    const getOne = await CrudService.getOne({
        modelData: {
            Model: ADDRESS,
            select: ["-__v"],
        }, data: { _id: request.params["id"] },
        populate: {}
    });
    response.json(getOne);
});
export const getManyAddress = catchAsync(async (request, response) => {
    const getMany = await CrudService.getMany({
        modelData: {
            Model: ADDRESS,
            select: ["-__v"],
        },
        query: request.query, filter: {},
        populate: {}
    });
    response.json(getMany);
});
export const updateAddress = catchAsync(async (request, response) => {
    const updateAddress = await CrudService.update({
        data: request.body,
        filter: { _id: request.params["id"] },
        modelData: {
            Model: ADDRESS,
            select: ["-__v"],
        },
    });
    response.json(updateAddress);
});
export const deleteAddress = catchAsync(async (request, response) => {
    const deleteAddress = await CrudService.delete({
        data: { _id: request.params["id"] },
        modelData: {
            Model: ADDRESS,
            select: ["-__v"],
        },
    });
    response.json(deleteAddress);
});
export const setDefaultAddress = catchAsync(async (request, response) => {
    const setDefaultAddress = await CrudService.update({
        data: { isDefault: true },
        filter: { _id: request.params["id"] },
        modelData: {
            Model: ADDRESS,
            select: ["-__v"],
        },
    });
    response.json(setDefaultAddress);
});
export const getAddressesByUser = catchAsync(async (request, response) => {
    const getMany = await CrudService.getMany({
        modelData: {
            Model: ADDRESS,
            select: ['-__v'],
        },
        query: request.query,
        filter: { userId: request.user.id },
        populate: {},
    });
    response.json(getMany);
});
export const getAddressByUser = catchAsync(async (request, response) => {
    const getOne = await CrudService.getOne({
        modelData: {
            Model: ADDRESS,
            select: ['-__v'],
        },
        data: { _id: request.params['id'], userId: request.user.id },
        populate: {},
    });
    response.json(getOne);
});
export const deleteAddressByUser = catchAsync(async (request, response) => {
    const deleteAddress = await CrudService.delete({
        data: { _id: request.params['id'], userId: request.user.id },
        modelData: {
            Model: ADDRESS,
            select: ['-__v'],
        },
    });
    response.json(deleteAddress);
});
export const updateAddressByUser = catchAsync(async (request, response) => {
    const updateAddress = await CrudService.update({
        data: request.body,
        filter: { _id: request.params['id'], userId: request.user.id },
        modelData: {
            Model: ADDRESS,
            select: ['-__v'],
        },
    });
    response.json(updateAddress);
});
//# sourceMappingURL=controller.address.js.map