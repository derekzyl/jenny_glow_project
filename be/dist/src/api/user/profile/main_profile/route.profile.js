"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_profile_1 = require("../index.profile");
const index_auth_1 = require("../../../auth/index.auth");
const index_factory_1 = require("../../../general_factory/index.factory");
const general_factory_1 = require("../../../general_factory/interface/general_factory");
const profileRouter = (0, express_1.Router)();
profileRouter
    .route("/")
    .post(index_auth_1.AuthIndex.protector, index_factory_1.GeneralIndex.getUserPermissions(general_factory_1.PermissionsE.CREATE_USER_PROFILE), index_profile_1.ProfileIndex.create_profile)
    .get(index_auth_1.AuthIndex.protector, index_factory_1.GeneralIndex.getUserPermissions(general_factory_1.PermissionsE.VIEW_USER_PROFILE), index_profile_1.ProfileIndex.get_all_profile);
profileRouter
    .route("/:id")
    .get(index_auth_1.AuthIndex.protector, index_profile_1.ProfileIndex.get_one_profile)
    .patch(index_auth_1.AuthIndex.protector, index_profile_1.ProfileIndex.update_profile)
    .delete(index_auth_1.AuthIndex.protector, index_factory_1.GeneralIndex.getUserPermissions(general_factory_1.PermissionsE.DELETE_USER_PROFILE), index_profile_1.ProfileIndex.delete_profile);
exports.default = profileRouter;
