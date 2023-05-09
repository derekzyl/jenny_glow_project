"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_role_1 = require("../index.role");
const index_auth_1 = require("../../../auth/index.auth");
const index_factory_1 = require("../../../general_factory/index.factory");
const general_factory_1 = require("../../../general_factory/interface/general_factory");
const roleRouter = (0, express_1.Router)();
roleRouter.route("/role/").post(index_auth_1.AuthIndex.protector, index_factory_1.GeneralIndex.getUserPermissions(general_factory_1.PermissionsE.CREATE_ROLE), index_role_1.RoleIndex.createRole).get(index_role_1.RoleIndex.getAllRole);
roleRouter
    .route("/create/:id")
    .patch(index_role_1.RoleIndex.updateRole)
    .delete(index_role_1.RoleIndex.deleteRole);
exports.default = roleRouter;
