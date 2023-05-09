"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.getOne = exports.updateOne = exports.deleteOne = exports.createOne = void 0;
const custom_error_1 = require("../../utilities/custom_error");
const http_response_1 = require("../../utilities/http_response");
const query_1 = require("../../utilities/query");
const response_message_1 = require("../../utilities/response_message");
const createOne = (MODEL) => (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const create_model = new MODEL(request.body);
        const created_model = yield create_model.save();
        if (!created_model) {
            throw (0, custom_error_1.APP_ERROR)(`${created_model}`, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        }
        return response.status(http_response_1.HTTP_RESPONSE.CREATED).json((0, response_message_1.responseMessage)({
            message: "created successfully",
            success_status: true,
            data: created_model,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.createOne = createOne;
const deleteOne = (MODEL) => (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const delete_model = yield MODEL.findByIdAndDelete(request.params.id);
        if (!delete_model) {
            throw (0, custom_error_1.APP_ERROR)(`${delete_model}`, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        }
        return response.status(http_response_1.HTTP_RESPONSE.CREATED).json((0, response_message_1.responseMessage)({
            message: "deleted successfully",
            success_status: true,
            data: delete_model,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.deleteOne = deleteOne;
const updateOne = (MODEL) => (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const update_model = yield MODEL.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
        if (!update_model) {
            throw (0, custom_error_1.APP_ERROR)(`${update_model}`, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        }
        return response.status(http_response_1.HTTP_RESPONSE.CREATED).json((0, response_message_1.responseMessage)({
            message: "updated successfully",
            success_status: true,
            data: update_model,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.updateOne = updateOne;
const getOne = (MODEL, populate_options) => (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let get_one_model = yield MODEL.findById(request.params.id);
        if (populate_options)
            get_one_model = get_one_model.populate(populate_options);
        if (!get_one_model) {
            throw (0, custom_error_1.APP_ERROR)(`could not get one data`, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        }
        return response.status(http_response_1.HTTP_RESPONSE.CREATED).json((0, response_message_1.responseMessage)({
            message: "gotten one data successfully",
            success_status: true,
            data: get_one_model,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.getOne = getOne;
const getAll = (MODEL) => (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const get_all = new query_1.Queries(MODEL, request.query)
            .filter()
            .limitFields()
            .paginate()
            .sort();
        if (!get_all) {
            throw (0, custom_error_1.APP_ERROR)(`query error`, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        }
        const get_all_data = yield get_all.query;
        return response.status(http_response_1.HTTP_RESPONSE.CREATED).json((0, response_message_1.responseMessage)({
            message: "gotten one data successfully",
            success_status: true,
            data: get_all_data,
            doc_length: get_all_data.length,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.getAll = getAll;
