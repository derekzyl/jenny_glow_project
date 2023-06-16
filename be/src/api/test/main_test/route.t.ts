import { Router } from "express";
import { AuthIndex } from "../../auth/index.auth";
import { GeneralIndex } from "../../general_factory/index.factory";
import { PermissionsE } from "../../general_factory/interface/general_factory";
import { TestIndex } from "../index.t";

const testRouter = Router();
testRouter
  .route("/")
  .post(
    // AuthIndex.protector,
    // GeneralIndex.getUserPermissions(PermissionsE.CREATE_ROLE),
    TestIndex.createTest
  )
  .get(
    // AuthIndex.protector,
    // GeneralIndex.getUserPermissions(PermissionsE.VIEW_ROLE),
    TestIndex.getAllTest
  );
testRouter
  .route("/:id")
  .patch(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.EDIT_ROLE),
    TestIndex.updateTest
  )
  .delete(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.DELETE_ROLE),
    TestIndex.deleteTest
  );
export default testRouter;
