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
exports.deleteProfile = exports.updateProfile = exports.getManyProfile = exports.getOneProfile = exports.createProfile = void 0;
const model_profile_1 = require("./model.profile");
const crud_1 = require("../../../general_factory/crud");
const get_role_1 = require("../../../../utilities/get_role");
const permission_handler_1 = require("../../../general_factory/permission_handler");
const general_factory_1 = require("../../../general_factory/interface/general_factory");
const http_response_1 = require("../../../../utilities/http_response");
const response_message_1 = require("../../../../utilities/response_message");
//todo profile receipt
const createProfile = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user = request.user;
        const body = request.body;
        const crud_profile = new crud_1.Crud(request, response, next);
        crud_profile.create({ model: model_profile_1.PROFILE, exempt: "" }, Object.assign(Object.assign({}, body), { user: body.user_id }), {});
    }
    catch (error) {
        next(error);
    }
});
exports.createProfile = createProfile;
const getOneProfile = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const get_role = yield (0, get_role_1.getRole)(request.user.id);
        let profile;
        const user = request.user;
        if (get_role && get_role.name === "USER") {
            profile = yield model_profile_1.PROFILE.findOne({
                user,
            }).select("-__v id");
        }
        else if (request.params.id &&
            (0, permission_handler_1.checkPermissions)(general_factory_1.PermissionsE.VIEW_USER_PROFILE, user)) {
            profile = yield model_profile_1.PROFILE.findById(request.params.id);
        }
        profile = profile === null || profile === void 0 ? void 0 : profile.populate("user", "phone");
        return response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
            data: profile,
            message: "fetched successfully",
            success_status: true,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.getOneProfile = getOneProfile;
const getManyProfile = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.getMany({ model: model_profile_1.PROFILE, exempt: "-__v, -user " }, request.query, {}, {});
});
exports.getManyProfile = getManyProfile;
const updateProfile = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    const check_permissions = (0, permission_handler_1.checkPermissions)(general_factory_1.PermissionsE.EDIT_USER_PROFILE, request.user.id);
    const data = {
        user: check_permissions ? undefined : request.user.id,
        id: check_permissions ? request.params.id : undefined,
    };
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.update({ model: model_profile_1.PROFILE, exempt: "-__v" }, data, Object.assign({}, body));
});
exports.updateProfile = updateProfile;
const deleteProfile = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const check_permissions = (0, permission_handler_1.checkPermissions)(general_factory_1.PermissionsE.DELETE_USER_PROFILE, request.user.id);
    const data = {
        user: check_permissions ? undefined : request.user.id,
        id: check_permissions ? request.params.id : undefined,
    };
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.delete({ model: model_profile_1.PROFILE, exempt: "-__v -created_at -updated_at" }, data);
});
exports.deleteProfile = deleteProfile;
