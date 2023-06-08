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
exports.getCart = exports.removeCart = exports.addCart = void 0;
const model_cart_1 = require("./model.cart");
const model_product_1 = require("../../../product/main_product/model.product");
const custom_error_1 = require("../../../../utilities/custom_error");
const http_response_1 = require("../../../../utilities/http_response");
const response_message_1 = require("../../../../utilities/response_message");
const crud_1 = require("../../../general_factory/crud");
const model_address_1 = require("../../address/main_address/model.address");
const model_vat_1 = require("../../../admin/vat/main_vat/model.vat");
const interface_vat_1 = require("../../../admin/vat/interface_vat/interface.vat");
const model_shipping_1 = require("../../../admin/shipping/main_shipping/model.shipping");
//todo address receipt
const addCart = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1) get product with request parameters
        const id = request.params.id;
        const get_product = yield model_product_1.PRODUCT.findById(id);
        if (!get_product) {
            throw (0, custom_error_1.APP_ERROR)("product not found sorry", http_response_1.HTTP_RESPONSE.NOT_FOUND);
        }
        // 2) get user information
        const user = request.user.id;
        // 3) find cart information
        let total_price = 0;
        let get_cart = yield model_cart_1.CART.findOne({ user: user.id });
        if (!get_cart)
            get_cart = yield model_cart_1.CART.create({ user: user });
        // 4) find default user address
        const find_user_default_address = yield model_address_1.ADDRESS.findOne({
            user: user,
            is_default: true,
        });
        // 5) find shipping fee
        let total_shipping_fee = 0;
        const find_shipping_fee = yield model_shipping_1.SHIPPING.findOne({
            country: find_user_default_address === null || find_user_default_address === void 0 ? void 0 : find_user_default_address.country,
        });
        //6) get state fee
        let state_fee;
        if (find_shipping_fee)
            state_fee = find_shipping_fee.states.find((state) => state.name === (find_user_default_address === null || find_user_default_address === void 0 ? void 0 : find_user_default_address.state));
        if (state_fee)
            state_fee = state_fee.state_shipping_fee;
        //7) get vat
        const find_vat = yield model_vat_1.VAT.findOne({ vat_name: interface_vat_1.VatE.ONLINE });
        if (!find_vat)
            ""; /*throw  APP_ERROR(" vat is not found")*/
        //8) find product in cart
        const find_product_in_cart = get_cart.products.find((product) => product.product.id === get_product.id);
        if (find_product_in_cart) {
            get_cart.products
                .filter((product) => product.product.id === get_product.id)
                .map((product) => {
                product.product_total_count += 1;
                product.product_total_price += get_product.discount_percentage
                    ? get_product.price -
                        (get_product.price * get_product.discount_percentage) / 100
                    : get_product.price;
                product.shipping_fee = product.product_total_count * state_fee;
                const total_product_price = product.shipping_fee + product.product_total_price;
                total_shipping_fee += product.shipping_fee;
                total_price += total_product_price;
            });
        }
        else {
            const product = {
                product: get_product.id,
                product_total_count: 1,
                product_total_price: get_product.discount_percentage
                    ? get_product.price -
                        (get_product.price * get_product.discount_percentage) / 100
                    : get_product.price,
                shipping_fee: state_fee,
            };
            total_shipping_fee += product.shipping_fee;
            total_price += product.product_total_price + product.shipping_fee;
        }
        get_cart.total_price = total_price;
        get_cart.total_shipping_fee = total_shipping_fee;
        get_cart.save();
        return response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
            data: `${get_product.name} added successfully to cart`,
            message: "added successfully",
            success_status: true,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.addCart = addCart;
const removeCart = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1) get product with request parameters
        const id = request.params.id;
        const get_product = yield model_product_1.PRODUCT.findById(id);
        if (!get_product) {
            throw (0, custom_error_1.APP_ERROR)("product not found sorry", http_response_1.HTTP_RESPONSE.NOT_FOUND);
        }
        // 2) get user information
        const user = request.user.id;
        // 3) find cart information
        let get_cart = yield model_cart_1.CART.findOne({ user: user.id });
        if (!get_cart)
            get_cart = yield model_cart_1.CART.create({ user: user });
        // 4) find default user address
        const find_user_default_address = yield model_address_1.ADDRESS.findOne({
            user: user,
            is_default: true,
        });
        // 5) find shipping fee
        const find_shipping_fee = yield model_shipping_1.SHIPPING.findOne({
            country: find_user_default_address === null || find_user_default_address === void 0 ? void 0 : find_user_default_address.country,
        });
        //6) get state fee
        let state_fee;
        if (find_shipping_fee)
            state_fee = find_shipping_fee.states.find((state) => state.name === (find_user_default_address === null || find_user_default_address === void 0 ? void 0 : find_user_default_address.state));
        if (state_fee)
            state_fee = state_fee.state_shipping_fee;
        //7) get vat
        const find_vat = yield model_vat_1.VAT.findOne({ vat_name: interface_vat_1.VatE.ONLINE });
        if (!find_vat)
            ""; /*throw  APP_ERROR(" vat is not found")*/
        //8) find product in cart
        const find_product_in_cart = get_cart.products.find((product) => product.product.id === get_product.id);
        if (find_product_in_cart && find_product_in_cart.product_total_count <= 1) {
            const get_item_index = get_cart.products.findIndex((p) => p.product.id === get_product.id);
            get_cart.products.splice(get_item_index, 1);
        }
        if (find_product_in_cart && find_product_in_cart.product_total_count > 1) {
            get_cart.products
                .filter((product) => product.product.id === get_product.id)
                .map((product) => {
                product.product_total_count -= 1;
                product.product_total_price -= get_product.discount_percentage
                    ? get_product.price -
                        (get_product.price * get_product.discount_percentage) / 100
                    : get_product.price;
                product.shipping_fee = product.product_total_count * state_fee;
            });
        }
        else {
            const product = {
                product: get_product.id,
                product_total_count: 1,
                product_total_price: get_product.discount_percentage
                    ? get_product.price -
                        (get_product.price * get_product.discount_percentage) / 100
                    : get_product.price,
                shipping_fee: state_fee,
            };
            get_cart.products.push(product);
        }
        get_cart.save();
        return response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
            data: `${get_product.name} added successfully to cart`,
            message: "added successfully",
            success_status: true,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.removeCart = removeCart;
const getCart = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const get_crud = new crud_1.Crud(request, response, next);
        yield get_crud.getMany({ model: model_cart_1.CART, exempt: "-user" }, request.query, { user: request.user.id }, { model: "products" });
    }
    catch (error) {
        next(error);
    }
});
exports.getCart = getCart;
