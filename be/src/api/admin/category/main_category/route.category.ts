import { Router } from "express";

import { AuthIndex } from "../../../auth/index.auth";
import { GeneralIndex } from "../../../general_factory/index.factory";
import { PermissionsE } from "../../../general_factory/interface/general_factory";
import { CategoryIndex, SubCategoryIndex } from "../index.category";

const categoryRouter = Router();
const subCategoryRouter = Router();

categoryRouter
  .route("/")
  .post(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.CREATE_CATEGORY),
    CategoryIndex.create_category
  )
  .get(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.VIEW_CATEGORY),
    CategoryIndex.get_all_category
  );
categoryRouter
  .route("/:id")
  .get(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.VIEW_CATEGORY),
    CategoryIndex.get_one_category
  )
  .patch(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.EDIT_CATEGORY),
    CategoryIndex.update_category
  )
  .delete(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.DELETE_CATEGORY),
    CategoryIndex.delete_category
  );

subCategoryRouter
  .route("/")
  .post(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.CREATE_CATEGORY),
    SubCategoryIndex.create_sub_category
  )
  .get(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.VIEW_CATEGORY),
    SubCategoryIndex.get_all_sub_category
  );
subCategoryRouter
  .route("/:id")
  .get(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.VIEW_CATEGORY),
    SubCategoryIndex.get_one_sub_category
  )
  .patch(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.EDIT_CATEGORY),
    SubCategoryIndex.update_sub_category
  )
  .delete(
    AuthIndex.protector,
    GeneralIndex.getUserPermissions(PermissionsE.DELETE_CATEGORY),
    SubCategoryIndex.delete_sub_category
  );

export { subCategoryRouter, categoryRouter };
