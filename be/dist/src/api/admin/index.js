"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_branch_1 = __importDefault(require("./branch/main_branch/route.branch"));
const route_role_1 = __importDefault(require("./role/main_role/route.role"));
const adminRouter = (0, express_1.Router)();
adminRouter.use("/branch", route_branch_1.default);
adminRouter.use("/role", route_role_1.default);
exports.default = adminRouter;
