import { adminGetAllCategory, adminGetAllSubCategory, adminGetOneCategory, adminGetOneSubCategory, createCategory, createSubCategory, deleteCategory, deleteSubCategory, getAllCategory, getAllSubCategory, getOneCategory, getOneSubCategory, updateCategory, updateSubCategory, } from "./controller.category";
class Category {
    constructor() {
        this.create_category = createCategory;
        this.get_one_category = getOneCategory;
        this.update_category = updateCategory;
        this.delete_category = deleteCategory;
        this.get_all_category = getAllCategory;
        //admin
        this.admin_get_one_category = adminGetOneCategory;
        this.admin_get_all_category = adminGetAllCategory;
    }
}
class SubCategory {
    constructor() {
        this.create_sub_category = createSubCategory;
        this.get_one_sub_category = getOneSubCategory;
        this.update_sub_category = updateSubCategory;
        this.delete_sub_category = deleteSubCategory;
        this.get_all_sub_category = getAllSubCategory;
        //admin
        this.admin_get_one_sub_category = adminGetOneSubCategory;
        this.admin_get_all_sub_category = adminGetAllSubCategory;
    }
}
export const CategoryIndex = new Category();
export const SubCategoryIndex = new SubCategory();
//# sourceMappingURL=index.category.js.map