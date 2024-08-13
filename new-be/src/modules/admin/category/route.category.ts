import { Router } from "express";

import { auth } from "@modules/auth";
import { allPermissions } from "@modules/setting/roles";

import { formFileHandler, MULTER_UPLOAD } from "@modules/utils/file_handler/middleware.file";
import { validate } from "@modules/validate";
import { categoryValidation } from ".";
import { GeneralIndex } from "../../general_factory/index.factory";
import { PermissionsE } from "../../general_factory/interface/general_factory";
import { CategoryIndex, SubCategoryIndex } from "./index.category";

const categoryRouter = Router();
const subCategoryRouter = Router();

categoryRouter
  .route("/")
  
  .get(
    auth(allPermissions.Category.GetAll),
    validate(categoryValidation.getCategory),
    
    CategoryIndex.get_all_category);


categoryRouter
  .route('/admin')
  .post(
    auth(allPermissions.Category.Create),
    validate(categoryValidation.createCategory),
    MULTER_UPLOAD.fields([{ name: 'image', maxCount: 1 }]),
    formFileHandler([{ name: 'image' }]),
    CategoryIndex.create_category
  )
  .get(
    auth(allPermissions.Category.GetAll),
    validate(categoryValidation.getCategory),

    CategoryIndex.admin_get_all_category
);
  


categoryRouter
  .route("/:id/category")
  .get(

    validate(categoryValidation.getOneCategory),
    
    CategoryIndex.get_one_category)

categoryRouter
  .route("/:id/admin-category")
  .get(
    auth(allPermissions.Category.Get),
    validate(categoryValidation.getOneCategory),
    
    CategoryIndex.admin_get_one_category)
  .patch(
    auth(allPermissions.Category.Update),
    validate(categoryValidation.updateCategory),
    CategoryIndex.update_category
  )
  .delete(
    auth(allPermissions.Category.Delete),
    validate(categoryValidation.getCategory),       
    CategoryIndex.delete_category
);
  


// user sub category
subCategoryRouter
  .route("/")

  .get(SubCategoryIndex.get_all_sub_category);

  //admin sub category
subCategoryRouter
  .route("/admin")
  .post(
    auth(allPermissions.Category.Create),
    GeneralIndex.getUserPermissions([
      PermissionsE.CREATE_CATEGORY,
      PermissionsE.SUPER_ADMIN,
    ]),
    MULTER_UPLOAD.fields([{ name: "image", maxCount: 1 }]),
    formFileHandler([{ name: "image" }]),
    SubCategoryIndex.create_sub_category
  )
  .get(
    auth(allPermissions.Category.GetAll),
    validate(categoryValidation.getSubCategory),
    SubCategoryIndex.get_all_sub_category);

// user sub category
subCategoryRouter
  .route('/:id/sub-category')
  .get(
    validate(categoryValidation.getOneSubCategory),
    SubCategoryIndex.get_one_sub_category
)
  //admin sub category
subCategoryRouter
  .route('/:id/admin-sub-category')
  .get(
    auth(allPermissions.Category.Get),
    validate(categoryValidation.getOneSubCategory),
    SubCategoryIndex.get_one_sub_category
  )
  .patch(
    auth(allPermissions.Category.Update),
    validate(categoryValidation.updateSubCategory),
    MULTER_UPLOAD.fields([{ name: 'image', maxCount: 1 }]),
    formFileHandler([{ name: 'image' }]),
    SubCategoryIndex.update_sub_category
  )
  .delete(
    auth(allPermissions.Category.Delete),
 validate(categoryValidation.getOneSubCategory),
    SubCategoryIndex.delete_sub_category
  );

export { categoryRouter, subCategoryRouter };

