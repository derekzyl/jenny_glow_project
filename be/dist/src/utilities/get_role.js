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
exports.getRole = void 0;
const model_role_1 = require("../api/admin/role/main_role/model.role");
const response_message_1 = require("./response_message");
const http_response_1 = require("./http_response");
const custom_error_1 = require("./custom_error");
/**
 * GET THE USER ROLE
 *
 * ----------------
 *
 *
 * @param {Types.ObjectId} id please note that the object coming in must be a role id from the user model
 * @returns {(Model<RoleI> |   APP_ERROR)} a type of error if user role dosnt exist or a role model
 *
 * @example
 * ```ts
 * getRole(id: string): Model<RoleI>
 * ```
 */
const getRole = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const get_role = yield model_role_1.ROLE.findById(id);
        if (get_role)
            return get_role;
        else {
            throw (0, custom_error_1.APP_ERROR)("the role came with some glitches", http_response_1.HTTP_RESPONSE.NOT_IMPLEMENTED);
        }
    }
    catch (error) {
        (0, response_message_1.responseMessage)({
            message: "error from getting role",
            data: error,
            success_status: false,
        });
    }
});
exports.getRole = getRole;
