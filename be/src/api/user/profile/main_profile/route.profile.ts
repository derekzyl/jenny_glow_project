import { Router } from "express";

import { ProfileIndex } from "../index.profile";
import { AuthIndex } from "../../../auth/index.auth";
import { GeneralIndex } from "../../../general_factory/index.factory";
import { PermissionsE } from "../../../general_factory/interface/general_factory";

const profileRouter = Router();

profileRouter
  .route("/")
  .post(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.CREATE_USER_PROFILE),
    ProfileIndex.create_profile
  )
  .get(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.VIEW_USER_PROFILE),
    ProfileIndex.get_all_profile
  );

profileRouter
  .route("/:id")
  .get(
    AuthIndex.protector,

    ProfileIndex.get_one_profile
  )
  .patch(AuthIndex.protector, ProfileIndex.update_profile)
  .delete(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.DELETE_USER_PROFILE),
    ProfileIndex.delete_profile
  );

export default profileRouter;
