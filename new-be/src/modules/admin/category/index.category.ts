import {
  adminGetAllCategory,
  adminGetAllSubCategory,
  adminGetOneCategory,
  adminGetOneSubCategory,
  createCategory,
  createSubCategory,
  deleteCategory,
  deleteSubCategory,
  getAllCategory,
  getAllSubCategory,
  getOneCategory,
  getOneSubCategory,
  updateCategory,
  updateSubCategory,
} from "./controller.category";

class Category {
  public create_category = createCategory;

  public get_one_category = getOneCategory;
  public update_category = updateCategory;
  public delete_category = deleteCategory;
  public get_all_category = getAllCategory;
  //admin
  public admin_get_one_category = adminGetOneCategory;
  public admin_get_all_category = adminGetAllCategory;

}

class SubCategory {
  public create_sub_category = createSubCategory;
  public get_one_sub_category = getOneSubCategory;
  public update_sub_category = updateSubCategory;
  public delete_sub_category = deleteSubCategory;
  public get_all_sub_category = getAllSubCategory;
  //admin
  public admin_get_one_sub_category = adminGetOneSubCategory;
  public admin_get_all_sub_category = adminGetAllSubCategory;
}

export const CategoryIndex = new Category();
export const SubCategoryIndex = new SubCategory();
