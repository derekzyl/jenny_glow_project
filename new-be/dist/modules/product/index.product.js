import { createProduct, createProductVariant, deleteProduct, deleteProductVariant, getManyProduct, getManyProductVariant, getOneProduct, getOneProductVariant, updateProduct, updateProductVariant } from "./main_product/controller.product";
class Product {
    constructor() {
        this.create_product = createProduct;
        this.get_one_product = getOneProduct;
        this.get_all_product = getManyProduct;
        this.update_product = updateProduct;
        this.delete_product = deleteProduct;
        this.create_product_variant = createProductVariant;
        this.get_one_product_variant = getOneProductVariant;
        this.get_many_product_variant = getManyProductVariant;
        this.update_product_variant = updateProductVariant;
        this.delete_product_variant = deleteProductVariant;
    }
}
export const ProductIndex = new Product();
//# sourceMappingURL=index.product.js.map