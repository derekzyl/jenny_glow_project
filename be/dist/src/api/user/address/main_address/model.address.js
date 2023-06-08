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
exports.ADDRESS = void 0;
const mongoose_1 = require("mongoose");
const custom_error_1 = require("../../../../utilities/custom_error");
const general_factory_1 = require("../../../general_factory/interface/general_factory");
const addressSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "USER" },
    address: { type: String, required: true },
    country: { type: String, required: true },
    local_government: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, minlength: 5, required: true },
    is_default: { type: Boolean, default: false },
}, { timestamps: general_factory_1.time_stamps });
addressSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (Boolean(this.is_default) === true) {
                const get_address = yield exports.ADDRESS.findOne({
                    user: this.user,
                    is_default: true,
                });
                if (get_address) {
                    get_address.is_default = false;
                    get_address.save();
                }
            }
        }
        catch (error) {
            throw (0, custom_error_1.APP_ERROR)(error);
        }
    });
});
exports.ADDRESS = (0, mongoose_1.model)("ADDRESS", addressSchema);
