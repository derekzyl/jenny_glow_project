"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const custom_error_1 = require("./src/utilities/custom_error");
const route_role_1 = __importDefault(require("./src/api/admin/role/main_role/route.role"));
const route_auth_1 = __importDefault(require("./src/api/auth/main_auth/route.auth"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/admin", route_role_1.default);
app.use("/auth", route_auth_1.default);
// });
app.use(custom_error_1.errorCenter);
exports.default = app;
