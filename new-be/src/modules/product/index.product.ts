import {
  createProduct,
  createProductVariant,
  deleteProduct,
  deleteProductVariant,
  getManyProduct,
  getManyProductVariant,
  getOneProduct,
  getOneProductVariant,
  updateProduct,
  updateProductVariant
} from "./main_product/controller.product";

class Product {
  public create_product = createProduct;
  public get_one_product = getOneProduct;
  public get_all_product = getManyProduct;
  public update_product = updateProduct;
  public delete_product = deleteProduct;
  public create_product_variant = createProductVariant;
  public get_one_product_variant = getOneProductVariant;
  public get_many_product_variant = getManyProductVariant;
  public update_product_variant = updateProductVariant;
  public delete_product_variant = deleteProductVariant;
}
export const ProductIndex = new Product();
