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
exports.Crud = void 0;
const custom_error_1 = require("../../utilities/custom_error");
const http_response_1 = require("../../utilities/http_response");
const query_1 = require("../../utilities/query");
const response_message_1 = require("../../utilities/response_message");
class Crud {
    constructor(request, response, next) {
        this.request = request;
        this.response = response;
        this.next = next;
    }
    create(MyModel, data, finder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const find = yield MyModel.model.findOne(finder);
                if (find)
                    throw (0, custom_error_1.APP_ERROR)(`the ${MyModel} ${finder} already exist in database`, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
                const create = new MyModel.model(data);
                const created = yield create.save();
                if (!created)
                    throw (0, custom_error_1.APP_ERROR)(`${finder} is not successfully created`, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
                return this.response.status(http_response_1.HTTP_RESPONSE.CREATED).json((0, response_message_1.responseMessage)({
                    success_status: true,
                    data: created,
                    message: "successfully created",
                }));
            }
            catch (error) {
                return this.next(error);
            }
        });
    }
    update(MyModel, data, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataF = [];
                if (Array.isArray(MyModel)) {
                    MyModel.forEach((model) => __awaiter(this, void 0, void 0, function* () {
                        const findAndUpdate = yield model.model
                            .findOneAndUpdate(filter, data)
                            .select(model.exempt);
                        if (!findAndUpdate)
                            throw (0, custom_error_1.APP_ERROR)(`${data} not updated successfully`, http_response_1.HTTP_RESPONSE.NOT_IMPLEMENTED);
                        else {
                            dataF.push(findAndUpdate);
                        }
                    }));
                }
                else {
                    const findAndUpdate = yield MyModel.model
                        .findOneAndUpdate(filter, data)
                        .select(MyModel.exempt);
                    if (!findAndUpdate)
                        throw (0, custom_error_1.APP_ERROR)(`${data} not updated successfully`);
                    else {
                        dataF.push(findAndUpdate);
                    }
                }
                return this.response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
                    success_status: true,
                    data: dataF,
                    message: "successfully updated ",
                }));
            }
            catch (error) {
                return this.next(error);
            }
        });
    }
    getMany(MyModels, query, category = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data;
                const all = [];
                if (Array.isArray(MyModels)) {
                    MyModels.forEach((model) => __awaiter(this, void 0, void 0, function* () {
                        let modelFind = model.model.find({ category });
                        if (model.exempt)
                            modelFind = modelFind.select(model.exempt);
                        const queryf = new query_1.Queries(modelFind, query)
                            .filter()
                            .limitFields()
                            .paginate()
                            .sort();
                        const queryG = yield queryf.model;
                        if (!queryG)
                            throw (0, custom_error_1.APP_ERROR)(`${model} is not successfully fetched`, http_response_1.HTTP_RESPONSE.NOT_FOUND);
                        data = all.push(queryG);
                    }));
                }
                else {
                    let modelFind = MyModels.model.find({ category });
                    if (MyModels.exempt)
                        modelFind = modelFind.select(MyModels.exempt);
                    const queryf = new query_1.Queries(modelFind, query);
                    const queryG = yield queryf.model;
                    if (!queryG)
                        throw (0, custom_error_1.APP_ERROR)(`${MyModels} is not successfully created`, http_response_1.HTTP_RESPONSE.NOT_FOUND);
                    data = queryG;
                }
                this.response.status(200).json((0, response_message_1.responseMessage)({
                    success_status: true,
                    message: "data fetched successfully",
                    data: data,
                }));
            }
            catch (error) {
                this.next(error);
            }
        });
    }
    delete(MyModel, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (Array.isArray(MyModel)) {
                    MyModel.forEach((model) => __awaiter(this, void 0, void 0, function* () {
                        const delet = yield model.model.deleteOne(data);
                        if (!delet)
                            throw (0, custom_error_1.APP_ERROR)(`${model} is not successfully deleted`, http_response_1.HTTP_RESPONSE.NOT_IMPLEMENTED);
                    }));
                }
                else {
                    const delet = yield MyModel.model.deleteOne(data);
                    if (!delet)
                        throw (0, custom_error_1.APP_ERROR)(`${MyModel} is not successfully deleted`, http_response_1.HTTP_RESPONSE.NOT_FOUND);
                }
                this.response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
                    success_status: true,
                    message: " deleted successfully",
                    data: "deleted",
                }));
            }
            catch (error) {
                this.next(error);
            }
        });
    }
    getOne(MyModel, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let get_one = [];
                if (Array.isArray(MyModel)) {
                    MyModel.forEach((model) => __awaiter(this, void 0, void 0, function* () {
                        get_one = yield model.model.findOne(data).select(model.exempt);
                        if (!get_one)
                            throw (0, custom_error_1.APP_ERROR)(`${model} is not successfully fetched`, http_response_1.HTTP_RESPONSE.NOT_IMPLEMENTED);
                    }));
                }
                else {
                    get_one.push(yield MyModel.model.findOne(data).select(MyModel.exempt));
                    if (!get_one)
                        throw (0, custom_error_1.APP_ERROR)(`${MyModel} is not successfully fetched`, http_response_1.HTTP_RESPONSE.NOT_FOUND);
                }
                this.response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
                    success_status: true,
                    message: " fetched successfully",
                    data: get_one,
                }));
            }
            catch (error) {
                this.next(error);
            }
        });
    }
}
exports.Crud = Crud;