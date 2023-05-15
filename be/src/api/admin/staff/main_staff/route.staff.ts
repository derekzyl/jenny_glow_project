import { Router } from "express";
import { AuthIndex } from "../../../auth/index.auth";
import { GeneralIndex } from "../../../general_factory/index.factory";
import { PermissionsE } from "../../../general_factory/interface/general_factory";
import { StaffIndex } from "../index.staff";

const staffRouter = Router();

staffRouter
  .route("/")
  .post(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.CREATE_STAFF),
    StaffIndex.create_staff
  )
  .get(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.VIEW_STAFF),
    StaffIndex.get_all_staff
  );
staffRouter
  .route("/:id")
  .get(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.VIEW_STAFF),
    StaffIndex.get_one_staff
  )
  .patch(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.EDIT_STAFF),
    StaffIndex.update_staff
  )
  .delete(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.DELETE_STAFF),
    StaffIndex.delete_staff
  );
staffRouter.route("/me").get(AuthIndex.protector, StaffIndex.get_staff_profile);

export default staffRouter;
