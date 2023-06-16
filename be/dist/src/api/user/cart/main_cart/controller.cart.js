"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartWithAddress = exports.getCart = exports.removeCart = exports.addCart = void 0;
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
const service_online_1 = require("../../../sales/online/main_online/service.online");
const number_checker_1 = require("../../../../utilities/number_checker");
//todo address receipt
const addCart = async (request, response, next) => {
    try {
        // 1) get product with request parameters
        const id = request.params.id;
        const get_product = await model_product_1.PRODUCT.findById(id);
        if (!get_product) {
            throw (0, custom_error_1.APP_ERROR)("product not found sorry", http_response_1.HTTP_RESPONSE.NOT_FOUND);
        }
        // 2) get user information
        const user = request.user.id;
        // 3) find cart information
        let total_price = 0;
        let sub_total = 0;
        let get_cart = await model_cart_1.CART.findOne({ user: user.id });
        if (!get_cart)
            get_cart = await model_cart_1.CART.create({ user: user });
        // 4) find default user address
        const find_user_default_address = await model_address_1.ADDRESS.findOne({
            user: user,
            is_default: true,
        });
        // 5) find shipping fee
        let total_shipping_fee = 0;
        const find_shipping_fee = await model_shipping_1.SHIPPING.findOne({
            country: find_user_default_address?.country,
        });
        //6) get state fee
        let state_fee;
        if (find_shipping_fee)
            state_fee = find_shipping_fee.states.find((state) => state.name === find_user_default_address?.state);
        if (state_fee)
            state_fee = (0, number_checker_1.n)(state_fee.state_shipping_fee);
        //7) get vat
        const find_vat = await model_vat_1.VAT.findOne({ vat_name: interface_vat_1.VatE.ONLINE });
        if (!find_vat)
            ""; /*throw  APP_ERROR(" vat is not found")*/
        //8) find product in cart
        const cart_item = await model_cart_1.CART_ITEM.findOne({
            product: get_product.id,
            cart_id: get_cart.id,
        });
        if (cart_item) {
            cart_item.product_total_count = cart_item.product_total_count + 1;
            cart_item.product_total_price += get_product.discount_percentage
                ? (0, number_checker_1.n)(get_product.price) -
                    ((0, number_checker_1.n)(get_product.price) * (0, number_checker_1.n)(get_product.discount_percentage)) / 100
                : (0, number_checker_1.n)(get_product.price);
            cart_item.shipping_fee =
                find_user_default_address && find_shipping_fee
                    ? (0, number_checker_1.n)(cart_item.product_total_count) * (0, number_checker_1.n)(state_fee)
                    : 0;
            const total_product_price = find_user_default_address && find_shipping_fee
                ? (0, number_checker_1.n)(cart_item.shipping_fee) + (0, number_checker_1.n)(cart_item.product_total_price)
                : (0, number_checker_1.n)(cart_item.product_total_price);
            sub_total += cart_item.product_total_price;
            total_price += total_product_price;
            cart_item.save();
        }
        else {
            const create_new_cart_item = new model_cart_1.CART_ITEM({
                product: get_product.id,
                product_total_count: 1,
                product_total_price: get_product.discount_percentage
                    ? get_product.price -
                        (get_product.price * get_product.discount_percentage) / 100
                    : get_product.price,
                shipping_fee: find_user_default_address && find_shipping_fee ? state_fee : 0,
                cart_id: get_cart.id,
            });
            const get_cart_item = await create_new_cart_item.save();
            total_shipping_fee =
                find_user_default_address && find_shipping_fee
                    ? get_cart_item.shipping_fee
                    : 0;
            total_price =
                find_user_default_address && find_shipping_fee
                    ? get_cart_item.product_total_price + get_cart_item.shipping_fee
                    : get_cart_item.product_total_price;
            sub_total += get_cart_item.product_total_price;
            get_cart.products.push(get_cart_item.id);
        }
        const get_vat = await model_vat_1.VAT.findOne({ vat_name: interface_vat_1.VatE.ONLINE });
        get_cart.total_price += get_vat?.vat_percentage
            ? total_price + (sub_total * Number(get_vat.vat_percentage)) / 100
            : total_price;
        get_cart.total_shipping_fee += total_shipping_fee;
        get_cart.sub_total += sub_total;
        get_cart.vat += get_vat?.vat_percentage
            ? ((0, number_checker_1.n)(sub_total) * (0, number_checker_1.n)(get_vat?.vat_percentage)) / 100
            : 0;
        get_cart.save();
        return response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
            data: `${get_product.name} added successfully to cart ${find_user_default_address && find_shipping_fee
                ? ""
                : "add your address before checkout because address missing"}`,
            message: "added successfully",
            success_status: true,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.addCart = addCart;
const removeCart = async (request, response, next) => {
    try {
        // 1) get product with request parameters
        const id = request.params.id;
        const get_product = await model_product_1.PRODUCT.findById(id);
        if (!get_product) {
            throw (0, custom_error_1.APP_ERROR)("product not found sorry", http_response_1.HTTP_RESPONSE.NOT_FOUND);
        }
        // 2) get user information
        const user = request.user.id;
        // 3) find cart information
        let total_price = 0;
        let sub_total = 0;
        let get_cart = await model_cart_1.CART.findOne({ user: user.id });
        if (!get_cart)
            get_cart = await model_cart_1.CART.create({ user: user });
        // 4) find default user address
        const find_user_default_address = await model_address_1.ADDRESS.findOne({
            user: user,
            is_default: true,
        });
        // 5) find shipping fee
        let total_shipping_fee = 0;
        const find_shipping_fee = await model_shipping_1.SHIPPING.findOne({
            country: find_user_default_address?.country,
        });
        //6) get state fee
        let state_fee;
        if (find_shipping_fee)
            state_fee = find_shipping_fee.states.find((state) => state.name === find_user_default_address?.state);
        if (state_fee)
            state_fee = state_fee.state_shipping_fee;
        //7) get vat
        const find_vat = await model_vat_1.VAT.findOne({ vat_name: interface_vat_1.VatE.ONLINE });
        if (!find_vat)
            ""; /*throw  APP_ERROR(" vat is not found")*/
        //8) find product in cart
        //8) find product in cart
        const cart_item = await model_cart_1.CART_ITEM.findOne({
            product: get_product.id,
            cart_id: get_cart.id,
        });
        if (!cart_item)
            throw (0, custom_error_1.APP_ERROR)("hi developer you arent handling this well");
        if (cart_item?.product_total_count > 1) {
            cart_item.product_total_count = cart_item.product_total_count - 1;
            cart_item.product_total_price -= get_product.discount_percentage
                ? (0, number_checker_1.n)(get_product.price) +
                    ((0, number_checker_1.n)(get_product.price) * get_product.discount_percentage) / 100
                : (0, number_checker_1.n)(get_product.price);
            cart_item.shipping_fee =
                find_user_default_address && find_shipping_fee
                    ? cart_item.product_total_count * state_fee
                    : 0;
            const total_product_price = find_user_default_address && find_shipping_fee
                ? cart_item.shipping_fee + cart_item.product_total_price
                : cart_item.product_total_price;
            total_price = total_product_price;
            sub_total = cart_item.product_total_price;
            cart_item.save();
        }
        else {
            total_shipping_fee -=
                find_user_default_address && find_shipping_fee
                    ? cart_item.shipping_fee
                    : 0;
            total_price =
                find_user_default_address && find_shipping_fee
                    ? cart_item.product_total_price + cart_item.shipping_fee
                    : cart_item.product_total_price;
            sub_total = cart_item.product_total_price;
            const find_product_index = get_cart.products.findIndex((p) => p.id === get_product.id);
            get_cart.products.splice(find_product_index, 1);
        }
        get_cart.total_price -= total_price;
        get_cart.total_shipping_fee -= total_shipping_fee;
        get_cart.sub_total -= sub_total;
        get_cart.vat = find_vat?.vat_percentage
            ? ((0, number_checker_1.n)(total_price) * (0, number_checker_1.n)(find_vat?.vat_percentage)) / 100
            : 0;
        get_cart.save();
        return response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
            data: `${get_product.name} removed successfully from cart ${find_user_default_address && find_shipping_fee
                ? ""
                : "add your address before checkout because address missing"}`,
            message: "added successfully",
            success_status: true,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.removeCart = removeCart;
const getCart = async (request, response, next) => {
    try {
        const get_crud = new crud_1.Crud(request, response, next);
        await get_crud.getOne({ model: model_cart_1.CART, exempt: "-user" }, { user: request.user.id }, { model: "products" });
    }
    catch (error) {
        next(error);
    }
};
exports.getCart = getCart;
const updateCartWithAddress = async (request, response, next) => {
    try {
        const get_cart = await model_cart_1.CART.findOne({ user: request.user.id });
        if (!get_cart)
            throw (0, custom_error_1.APP_ERROR)("Cart not found developer error", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        const get_address_id = request.params.address_id;
        const get_address = await model_address_1.ADDRESS.findById(get_address_id);
        if (!get_address)
            throw (0, custom_error_1.APP_ERROR)("Address not found developer error", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        let total_price = 0;
        let total_shipping_fee = 0;
        const get_cart_items = await model_cart_1.CART_ITEM.find({
            cart_id: get_cart.id,
        });
        if (get_cart_items.length > 0) {
            const get_shipping_fee = await (0, service_online_1.calculateAddressFee)(get_address.id);
            for (const cart_item of get_cart_items) {
                const get_cart_item = await model_cart_1.CART_ITEM.findById(cart_item.id);
                if (!get_cart_item)
                    throw (0, custom_error_1.APP_ERROR)("Cart item not found");
                const find_and_update_cart_item = await model_cart_1.CART_ITEM.findByIdAndUpdate(cart_item.id, {
                    shipping_fee: get_shipping_fee * get_cart_item.product_total_count,
                });
                if (find_and_update_cart_item) {
                    const calculate_total = find_and_update_cart_item?.shipping_fee +
                        find_and_update_cart_item?.product_total_price;
                    total_price += calculate_total;
                    total_shipping_fee += find_and_update_cart_item.shipping_fee;
                }
            }
            get_cart.total_price = total_price;
            get_cart.total_shipping_fee = total_shipping_fee;
            get_cart.save();
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateCartWithAddress = updateCartWithAddress;
