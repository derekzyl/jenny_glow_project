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
exports.getWishlist = exports.removeWishlist = exports.addWishlist = void 0;
const model_wishlist_1 = require("./model.wishlist");
const model_product_1 = require("../../../product/main_product/model.product");
const custom_error_1 = require("../../../../utilities/custom_error");
const http_response_1 = require("../../../../utilities/http_response");
const response_message_1 = require("../../../../utilities/response_message");
const crud_1 = require("../../../general_factory/crud");
//todo address receipt
const addWishlist = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = request.params.id;
        const get_product = yield model_product_1.PRODUCT.findById(id);
        if (!get_product) {
            throw (0, custom_error_1.APP_ERROR)("product not found sorry", http_response_1.HTTP_RESPONSE.NOT_FOUND);
        }
        const user = request.user;
        let get_wish_list = yield model_wishlist_1.WISHLIST.findOne({ user: user.id });
        if (!get_wish_list)
            get_wish_list = yield model_wishlist_1.WISHLIST.create({ user: user });
        get_wish_list.products = get_wish_list.products.concat(get_product.id);
        get_wish_list.save();
        return response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
            data: `${get_product.name} added successfully to wish list`,
            message: "added successfully",
            success_status: true,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.addWishlist = addWishlist;
const removeWishlist = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = request.params.id;
        const get_product = yield model_product_1.PRODUCT.findById(id);
        if (!get_product) {
            throw (0, custom_error_1.APP_ERROR)("product not found sorry", http_response_1.HTTP_RESPONSE.NOT_FOUND);
        }
        const user = request.user;
        const get_wish_list = yield model_wishlist_1.WISHLIST.findOne({ user: user.id }).populate("products");
        if (!get_wish_list)
            throw (0, custom_error_1.APP_ERROR)("oops some error glitch here", http_response_1.HTTP_RESPONSE.FORBIDDEN);
        get_wish_list.products = get_wish_list === null || get_wish_list === void 0 ? void 0 : get_wish_list.products.filter((product) => product.id !== get_product.id);
        get_wish_list.save();
        return response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
            data: `${get_product.name} removed successfully from wish list`,
            message: "removed successfully",
            success_status: true,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.removeWishlist = removeWishlist;
const getWishlist = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const get_crud = new crud_1.Crud(request, response, next);
        yield get_crud.getMany({ model: model_wishlist_1.WISHLIST, exempt: "-user" }, request.query, { user: request.user.id }, { model: "products" });
    }
    catch (error) {
        next(error);
    }
});
exports.getWishlist = getWishlist;
