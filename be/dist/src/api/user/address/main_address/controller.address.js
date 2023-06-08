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
exports.deleteAddress = exports.updateAddress = exports.getManyAddress = exports.getOneAddress = exports.createAddress = void 0;
const model_address_1 = require("./model.address");
const crud_1 = require("../../../general_factory/crud");
const permission_handler_1 = require("../../../general_factory/permission_handler");
const general_factory_1 = require("../../../general_factory/interface/general_factory");
//todo address receipt
const createAddress = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        const body = request.body;
        const crud_address = new crud_1.Crud(request, response, next);
        crud_address.create({ model: model_address_1.ADDRESS, exempt: "" }, Object.assign(Object.assign({}, body), { user: user.id }), {});
    }
    catch (error) {
        next(error);
    }
});
exports.createAddress = createAddress;
const getOneAddress = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const check_user_clearance = (0, permission_handler_1.checkPermissions)(general_factory_1.PermissionsE.VIEW_USER_PROFILE, request.user);
    const user = check_user_clearance ? undefined : request.user.id;
    const crud_address = new crud_1.Crud(request, response, next);
    crud_address.getOne({ model: model_address_1.ADDRESS, exempt: "-__v -user " }, { id: request.params.id, user }, {});
});
exports.getOneAddress = getOneAddress;
const getManyAddress = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.getMany({ model: model_address_1.ADDRESS, exempt: "-__v, -user " }, request.query, {}, {});
});
exports.getManyAddress = getManyAddress;
const updateAddress = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.update({ model: model_address_1.ADDRESS, exempt: "-__v" }, { id: request.params.id }, Object.assign({}, body));
});
exports.updateAddress = updateAddress;
const deleteAddress = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.delete({ model: model_address_1.ADDRESS, exempt: "-__v -created_at -updated_at" }, { id: request.params.id });
});
exports.deleteAddress = deleteAddress;
