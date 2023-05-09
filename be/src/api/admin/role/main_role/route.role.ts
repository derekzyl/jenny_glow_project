import { Router } from "express";
import { RoleIndex } from "../index.role";
import { AuthIndex } from "../../../auth/index.auth";
import { GeneralIndex } from "../../../general_factory/index.factory";
import { PermissionsE } from "../../../general_factory/interface/general_factory";

const roleRouter = Router();
roleRouter
  .route("/role/")
  .post(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.CREATE_ROLE),
    RoleIndex.createRole
  )
  .get(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.VIEW_ROLE),
    RoleIndex.getAllRole
  );
roleRouter
  .route("/create/:id")
  .patch(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.EDIT_ROLE),
    RoleIndex.updateRole
  )
  .delete(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.DELETE_ROLE),
    RoleIndex.deleteRole
  );
export default roleRouter;
