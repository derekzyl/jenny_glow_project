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
exports.addShippingFee = exports.fetchCountryAndState = void 0;
const countries_states_json_1 = __importDefault(require("../countries_states.json"));
const http_response_1 = require("../../../utilities/http_response");
const response_message_1 = require("../../../utilities/response_message");
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
const addShippingFee = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.addShippingFee = addShippingFee;
