"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_role_1 = __importDefault(require("./src/admin/role/main_role/route.role"));
const custom_error_1 = require("./src/utilities/custom_error");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/admin", route_role_1.default);
// });
app.use(custom_error_1.errorCenter);
exports.default = app;
