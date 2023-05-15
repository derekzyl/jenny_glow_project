"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryIndex = exports.CategoryIndex = void 0;
const controller_category_1 = require("./main_category/controller.category");
class Category {
    constructor() {
        this.create_category = controller_category_1.createCategory;
        this.get_one_category = controller_category_1.getOneCategory;
        this.update_category = controller_category_1.updateCategory;
        this.delete_category = controller_category_1.deleteCategory;
        this.get_all_category = controller_category_1.getAllCategory;
    }
}
class SubCategory {
    constructor() {
        this.create_sub_category = controller_category_1.createSubCategory;
        this.get_one_sub_category = controller_category_1.getOneSubCategory;
        this.update_sub_category = controller_category_1.updateSubCategory;
        this.delete_sub_category = controller_category_1.deleteSubCategory;
        this.get_all_sub_category = controller_category_1.getAllSubCategory;
    }
}
exports.CategoryIndex = new Category();
exports.SubCategoryIndex = new SubCategory();
