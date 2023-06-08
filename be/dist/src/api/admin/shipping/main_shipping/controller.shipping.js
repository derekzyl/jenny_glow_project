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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllShippingFee = exports.deleteShippingFee = exports.updateShippingFee = exports.addShippingFee = exports.getOneShippingFee = exports.fetchCountryAndState = void 0;
const countries_states_json_1 = __importDefault(require("../countries_states.json"));
const custom_error_1 = require("../../../../utilities/custom_error");
const http_response_1 = require("../../../../utilities/http_response");
const response_message_1 = require("../../../../utilities/response_message");
const crud_1 = require("../../../general_factory/crud");
const model_shipping_1 = require("./model.shipping");
const fetchCountryAndState = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
            data: countries_states_json_1.default,
            success_status: true,
            message: "fetched address successfully",
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.fetchCountryAndState = fetchCountryAndState;
const getOneShippingFee = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state, country } = request.body;
        const get_shipping_fee = yield model_shipping_1.SHIPPING.findOne({
            country: country.toUpperCase(),
        });
        if (!get_shipping_fee)
            throw (0, custom_error_1.APP_ERROR)("shipping fee for selected location not found");
        const find_state_fee = get_shipping_fee.states.filter((sta) => sta.name === state);
        if (!find_state_fee)
            throw (0, custom_error_1.APP_ERROR)("hey this is not found here at all");
        const shipping_fee = get_shipping_fee.use_country_shipping_fee_as_default
            ? get_shipping_fee.country_shipping_fee
            : find_state_fee;
        response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
            data: { shipping_fee },
            success_status: true,
            message: "fetched address successfully",
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.getOneShippingFee = getOneShippingFee;
const addShippingFee = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { country, country_shipping_fee, states, use_country_shipping_fee_as_default, } = request.body;
        const find_country_in_db = yield model_shipping_1.SHIPPING.findOne({
            country: country.toUpperCase(),
        });
        if (!find_country_in_db) {
            if (use_country_shipping_fee_as_default) {
                states.map((state) => (state.state_shipping_fee = country_shipping_fee));
            }
            const create_country_shipping = model_shipping_1.SHIPPING.create({
                created_by: request.user.id,
                country,
                country_shipping_fee,
                use_country_shipping_fee_as_default,
                states,
            });
            if (!create_country_shipping) {
                throw (0, custom_error_1.APP_ERROR)("oops shipping fee not created");
            }
        }
        else {
            if (use_country_shipping_fee_as_default) {
                states.map((state) => (state.state_shipping_fee = country_shipping_fee));
            }
            const update_shipping = yield model_shipping_1.SHIPPING.updateOne({ country: find_country_in_db.country }, {
                $addToSet: {
                    states: { $each: states },
                },
                use_country_shipping_fee_as_default,
                country_shipping_fee,
            });
            if (!update_shipping)
                throw (0, custom_error_1.APP_ERROR)("sorry we couldn't update shipping either");
        }
        response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
            data: countries_states_json_1.default,
            success_status: true,
            message: "fetched address successfully",
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.addShippingFee = addShippingFee;
const updateShippingFee = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { country_shipping_fee, states, use_country_shipping_fee_as_default, } = request.body;
        const country = request.params.id;
        yield model_shipping_1.SHIPPING.updateOne({ country }, { $addToSet: { states: { $each: states } } });
        const find_country_in_db = yield model_shipping_1.SHIPPING.findOne({ country });
        if (find_country_in_db) {
            if (use_country_shipping_fee_as_default) {
                find_country_in_db === null || find_country_in_db === void 0 ? void 0 : find_country_in_db.states.map((state) => (state.state_shipping_fee =
                    country_shipping_fee !== null && country_shipping_fee !== void 0 ? country_shipping_fee : find_country_in_db.country_shipping_fee));
                find_country_in_db.use_country_shipping_fee_as_default =
                    use_country_shipping_fee_as_default;
            }
            yield find_country_in_db.save();
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateShippingFee = updateShippingFee;
const deleteShippingFee = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shipping_crud = new crud_1.Crud(request, response, next);
        yield shipping_crud.delete({ model: model_shipping_1.SHIPPING, exempt: "" }, { id: request.params.id });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteShippingFee = deleteShippingFee;
const getAllShippingFee = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state, country } = request.body;
        const get_many_shipping_fee = new crud_1.Crud(request, response, next);
        get_many_shipping_fee.getMany({ model: model_shipping_1.SHIPPING, exempt: "" }, request.query, {}, {});
    }
    catch (error) {
        next(error);
    }
});
exports.getAllShippingFee = getAllShippingFee;
