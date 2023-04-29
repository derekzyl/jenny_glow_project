"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_role_1 = require("../index.role");
const roleRouter = (0, express_1.Router)();
roleRouter.route("/role/").post(index_role_1.RoleIndex.createRole).get(index_role_1.RoleIndex.getAllRole);
roleRouter
    .route("/create/:id")
    .patch(index_role_1.RoleIndex.updateRole)
    .delete(index_role_1.RoleIndex.deleteRole);
exports.default = roleRouter;
