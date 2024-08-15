import { ApiError } from "../errors";
import responseMessage from "../genCrud/responseMessage";
import { Queries } from "../utils/query";
import httpStatus from "http-status";
export const createOne = (MODEL) => async (request, response, next) => {
    try {
        const create_model = new MODEL(request.body);
        const created_model = await create_model.save();
        if (!created_model) {
            throw new ApiError(httpStatus.BAD_REQUEST, `${created_model}`);
        }
        response.status(httpStatus.CREATED).json(responseMessage({
            message: "created successfully",
            success_status: true,
            data: created_model,
        }));
    }
    catch (error) {
        next(error);
    }
};
export const deleteOne = (MODEL) => async (request, response, next) => {
    try {
        const delete_model = await MODEL.findByIdAndDelete(request.params["id"]);
        if (!delete_model) {
            throw new ApiError(httpStatus.BAD_REQUEST, `${delete_model}`);
        }
        response.status(httpStatus.CREATED).json(responseMessage({
            message: "deleted successfully",
            success_status: true,
            data: delete_model,
        }));
    }
    catch (error) {
        next(error);
    }
};
export const updateOne = (MODEL) => async (request, response, next) => {
    try {
        const update_model = await MODEL.findByIdAndUpdate(request.params["id"], Object.assign(Object.assign({}, request.body), { updated_at: Date.now() }), { new: true, runValidators: true });
        if (!update_model) {
            throw new ApiError(httpStatus.BAD_REQUEST, `${update_model}`);
        }
        response.status(httpStatus.CREATED).json(responseMessage({
            message: "updated successfully",
            success_status: true,
            data: update_model,
        }));
    }
    catch (error) {
        next(error);
    }
};
export const getOne = (MODEL, populate_options) => async (request, response, next) => {
    try {
        let get_one_model = await MODEL.findById(request.params["id"]);
        if (populate_options)
            get_one_model = get_one_model.populate(populate_options);
        if (!get_one_model) {
            throw new ApiError(httpStatus.BAD_REQUEST, `could not get one data`);
        }
        response.status(httpStatus.CREATED).json(responseMessage({
            message: "gotten one data successfully",
            success_status: true,
            data: get_one_model,
        }));
    }
    catch (error) {
        next(error);
    }
};
export const getAll = (MODEL) => async (request, response, next) => {
    try {
        const get_all = new Queries(MODEL, request.query)
            .filter()
            .limitFields()
            .paginate()
            .sort();
        if (!get_all) {
            throw new ApiError(httpStatus.BAD_REQUEST, `query error`);
        }
        const get_all_data = await get_all.model;
        response.status(httpStatus.CREATED).json(responseMessage({
            message: "gotten one data successfully",
            success_status: true,
            data: get_all_data,
            doc_length: get_all_data.length,
        }));
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=controller.factory.js.map