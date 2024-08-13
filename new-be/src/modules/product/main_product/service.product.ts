import { ApiError } from '@modules/errors';
import { imageDeleteHandler } from '@modules/utils/file_handler/files_handler';
import { CrudService } from 'expressbolt';
import { Types } from 'mongoose';
import { ProductBodyI, ProductI, ProductVariantBodyI, ProductVariantI } from '../interface_product/interface.product';
import { PRODUCT, PRODUCT_VARIANT } from './model.product';

export async function createProduct(data:Omit< ProductI,'searchTags'> & { productVariant: ProductVariantBodyI[] }) {
  // create search tags from the name and description
  let searchTags = data.name.split(' ').concat(data.description.split(' '));
searchTags = searchTags.map((tag) => tag.toLowerCase());

  const product = await CrudService.create<ProductI>({
    modelData: {
      Model: PRODUCT,
      select: [],
    },
    data: { ...data, searchTags },
    check: {},
  });

  if (product['success']) {
    const productId = product['data']!.id;
    const productVariantData = data.productVariant.map((item) => ({ ...item, productId: productId, createdBy: data.createdBy, updatedBy: data.createdBy }));
    await CrudService.createMany({
      modelData: {
        Model: PRODUCT_VARIANT,
        select: [],
      },
      data: productVariantData,
      check: [],
    });
  }
  return product;
}

export async function getOneProduct(productId: Types.ObjectId) {
  const product = await CrudService.getOne<ProductI>({
    modelData: {
      Model: PRODUCT,
      select: [],
    },
    data: { id: productId },
    populate: {},
  });
  const productVariant = await CrudService.getMany<ProductVariantI>({
    modelData: {
      Model: PRODUCT_VARIANT,
      select: [],
    },
    filter: { productId: productId },
    populate: {},
    query: {},
  });

  return {
    success: product.success,
    data: { product: product.data, productVariant: productVariant.data },
    message: 'data fetched successfully',
  };
}

export async function getManyProduct(query: Record<string, any>) {
  const products = await CrudService.getMany<ProductI>({
    modelData: {
      Model: PRODUCT,
      select: [],
    },
    filter: {},
    populate: {},
    query,
  });

  return products;
}

export async function updateProduct(
  productId: Types.ObjectId,
  data: Partial<Omit<ProductBodyI, 'searchTags'>> & { updatedBy: Types.ObjectId }    
) {

    const getProduct = await CrudService.getOne<ProductI>({
    modelData: {
      Model: PRODUCT,
      select: [],
        },
        data: { id: productId },populate:{}
        
    });

    if (!getProduct.success || !getProduct.data) {
        throw new ApiError(404, 'Product not found');
        
    }
    if (data.image) {
        getProduct.data!.image ? imageDeleteHandler(getProduct.data!.image) : '';
    }
    if (data.otherImage1) {
        getProduct.data!.otherImage1 ? imageDeleteHandler(getProduct.data!.otherImage1) : '';
    }
    if (data.otherImage2) {
        getProduct.data!.otherImage2 ? imageDeleteHandler(getProduct.data!.otherImage2) : '';
    }
    if (data.otherImage3) {
        getProduct.data!.otherImage3 ? imageDeleteHandler(getProduct.data!.otherImage3) : '';
    }


  const product = await CrudService.update<ProductI>({
    modelData: {
      Model: PRODUCT,
      select: [],
    },
    data,
    filter: { id: productId },
  });

  return product;
}

export async function deleteProduct (productId: Types.ObjectId) {
    const getProduct = await CrudService.getOne<ProductI>({
    modelData: {
      Model: PRODUCT,
      select: [],
        },
        data: { id: productId },populate:{}
        
    });
    if (!getProduct.success || !getProduct.data) {
        throw new ApiError(404, 'Product not found');
        
    }
    getProduct.data!.image ? imageDeleteHandler(getProduct.data!.image) : '';
    getProduct.data!.otherImage1 ? imageDeleteHandler(getProduct.data!.otherImage1) : '';
    getProduct.data!.otherImage2 ? imageDeleteHandler(getProduct.data!.otherImage2) : '';
    getProduct.data!.otherImage3 ? imageDeleteHandler(getProduct.data!.otherImage3) : '';

    const getProductVariant = await CrudService.getMany<ProductVariantI>({
    modelData: {
      Model: PRODUCT_VARIANT,
      select: [],
        },
        filter:{productId:productId},populate:{},query:{}
        
    });
    if (getProductVariant.success && getProductVariant.data) {
        for (const item of getProductVariant.data) {
            item.image ? imageDeleteHandler(item.image) : '';
        }
    }

  const product = await CrudService.delete<ProductI>({
    modelData: {
      Model: PRODUCT,
      select: [],
    },
   data: { id: productId },
  });

    
    await CrudService.deleteMany({
    modelData: {
      Model: PRODUCT_VARIANT,
      select: [],
        },
        data: { product: productId },
    });
  return product;
}

export async function createProductVariant(data: ProductVariantI) {
  const productVariant = await CrudService.create<ProductVariantI>({
    modelData: {
      Model: PRODUCT_VARIANT,
      select: [],
    },
    data,
    check: {},
  });

  return productVariant;
}

export async function getOneProductVariant(productVariantId: Types.ObjectId) {
  const productVariant = await CrudService.getOne<ProductVariantI>({
    modelData: {
      Model: PRODUCT_VARIANT,
      select: [],
    },
    data: { id: productVariantId },
    populate: {},
  });

  return productVariant;
}

export async function getManyProductVariant(query: Record<string, any>) {
  const productVariant = await CrudService.getMany<ProductVariantI>({
    modelData: {
      Model: PRODUCT_VARIANT,
      select: [],
    },
    filter: {},
    populate: {},
    query,
  });

  return productVariant;
}


export async function updateProductVariant(productVariantId: Types.ObjectId, data: Partial<ProductVariantI>&{updatedBy:Types.ObjectId}) {
    const getProductVariant = await CrudService.getOne<ProductVariantI>({
    modelData: {
      Model: PRODUCT_VARIANT,
      select: [],
        },
        data: { id: productVariantId },populate:{}
        
    });
    if (!getProductVariant.success || !getProductVariant.data) {
        throw new ApiError(404, 'Product Variant not found');
        
    }
    if (data.image) {
        getProductVariant.data!.image ? imageDeleteHandler(getProductVariant.data!.image) : '';
    }

  
    const productVariant = await CrudService.update<ProductVariantI>({
    modelData: {
      Model: PRODUCT_VARIANT,
      select: [],
    },
    data,
    filter: { id: productVariantId },
  });

  return productVariant;
}


export async function deleteProductVariant(productVariantId: Types.ObjectId) {
 
    const getProductVariant = await CrudService.getOne<ProductVariantI>({
    modelData: {
      Model: PRODUCT_VARIANT,
      select: [],
        },
        data: { id: productVariantId },populate:{}
        
    });
    if (!getProductVariant.success || !getProductVariant.data) {
        throw new ApiError(404, 'Product Variant not found');
        
    }
    getProductVariant.data!.image ? imageDeleteHandler(getProductVariant.data!.image) : '';

    const productVariant = await CrudService.delete<ProductVariantI>({
    modelData: {
      Model: PRODUCT_VARIANT,
      select: [],
    },
    data: { id: productVariantId },
  });

  return productVariant;
}