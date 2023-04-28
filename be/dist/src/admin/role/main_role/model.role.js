"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const role_model = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
});
role_model.pre("save", function () {
    this.name = String(this.name).toLocaleUpperCase();
});
exports.ROLE = mongoose_1.default.model("ROLE", role_model);
