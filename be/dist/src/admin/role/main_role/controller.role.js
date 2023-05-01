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
exports.deleteOneRole = exports.updateOneRole = exports.getAllRole = exports.createRole = void 0;
const custom_error_1 = require("../../../utilities/custom_error");
const http_response_1 = require("../../../utilities/http_response");
const model_role_1 = require("./model.role");
const response_message_1 = require("../../../utilities/response_message");
const createRole = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { name } = request.body;
    try {
        name = name.toUpperCase();
        const name_regex = /^[A-Z]{3,}$/g;
        if (!name_regex.test(name)) {
            throw (0, custom_error_1.APP_ERROR)("please check the role name and use another name", http_response_1.HTTP_RESPONSE.FORBIDDEN);
        }
        // if (name === "ADMIN" || name === "admin") {
        //   throw APP_ERROR(
        //     "you cant add the name admin, oops",
        //     HTTP_RESPONSE.FORBIDDEN
        //   );
        // }
        const create_role = new model_role_1.ROLE({ name });
        const role_created = yield create_role.save();
        response
            .status(http_response_1.HTTP_RESPONSE.CREATED)
            .json((0, response_message_1.responseMessage)("role created successfully", true, role_created));
    }
    catch (error) {
        error.information = "error encountered creating role";
        next(error);
    }
});
exports.createRole = createRole;
const getAllRole = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const get_all_role = yield model_role_1.ROLE.find();
        response
            .status(http_response_1.HTTP_RESPONSE.OK)
            .json((0, response_message_1.responseMessage)("role gotten successfully", true, get_all_role));
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRole = getAllRole;
const updateOneRole = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role_id } = request.params;
    const { name } = request.body;
    try {
        const get_one_role = yield model_role_1.ROLE.findById({ role_id });
        if (!get_one_role)
            throw (0, custom_error_1.APP_ERROR)("the role id is not in the database", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        const updated_role = yield model_role_1.ROLE.findByIdAndUpdate(role_id, name);
        response
            .status(http_response_1.HTTP_RESPONSE.OK)
            .json((0, response_message_1.responseMessage)("role created successfully", true, updated_role));
    }
    catch (error) {
        next(error);
    }
});
exports.updateOneRole = updateOneRole;
const deleteOneRole = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role_id } = request.params;
    try {
        const get_one_role = yield model_role_1.ROLE.findById({ role_id });
        if (!get_one_role)
            throw (0, custom_error_1.APP_ERROR)("the role id is not in the database", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        const deleted_role = yield model_role_1.ROLE.findByIdAndDelete(role_id);
        response
            .status(http_response_1.HTTP_RESPONSE.OK)
            .json((0, response_message_1.responseMessage)("role created successfully", true, deleted_role));
    }
    catch (error) {
        next(error);
    }
});
exports.deleteOneRole = deleteOneRole;