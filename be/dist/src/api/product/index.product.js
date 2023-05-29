"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductIndex = void 0;
const controller_product_1 = require("./main_product/controller.product");
class Product {
    constructor() {
        this.create_product = controller_product_1.createProduct;
        this.get_one_product = controller_product_1.getOneProduct;
        this.get_all_product = controller_product_1.getManyProduct;
        this.update_product = controller_product_1.updateProduct;
        this.delete_product = controller_product_1.deleteProduct;
    }
}
exports.ProductIndex = new Product();
