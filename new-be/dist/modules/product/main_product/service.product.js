import { ApiError } from '../../errors';
import { imageDeleteHandler } from '../../utils/file_handler/files_handler';
import { CrudService } from 'expressbolt';
import { PRODUCT, PRODUCT_VARIANT } from './model.product';
export async function createProduct(data) {
    // create search tags from the name and description
    let searchTags = data.name.split(' ').concat(data.description.split(' '));
    searchTags = searchTags.map((tag) => tag.toLowerCase());
    const product = await CrudService.create({
        modelData: {
            Model: PRODUCT,
            select: [],
        },
        data: Object.assign(Object.assign({}, data), { searchTags }),
        check: {},
    });
    if (product['success']) {
        const productId = product['data'].id;
        const productVariantData = data.productVariant.map((item) => (Object.assign(Object.assign({}, item), { productId: productId, createdBy: data.createdBy, updatedBy: data.createdBy })));
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
export async function getOneProduct(productId) {
    const product = await CrudService.getOne({
        modelData: {
            Model: PRODUCT,
            select: [],
        },
        data: { id: productId },
        populate: {},
    });
    const productVariant = await CrudService.getMany({
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
export async function getManyProduct(query) {
    const products = await CrudService.getMany({
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
export async function updateProduct(productId, data) {
    const getProduct = await CrudService.getOne({
        modelData: {
            Model: PRODUCT,
            select: [],
        },
        data: { id: productId }, populate: {}
    });
    if (!getProduct.success || !getProduct.data) {
        throw new ApiError(404, 'Product not found');
    }
    if (data.image) {
        getProduct.data.image ? imageDeleteHandler(getProduct.data.image) : '';
    }
    if (data.otherImage1) {
        getProduct.data.otherImage1 ? imageDeleteHandler(getProduct.data.otherImage1) : '';
    }
    if (data.otherImage2) {
        getProduct.data.otherImage2 ? imageDeleteHandler(getProduct.data.otherImage2) : '';
    }
    if (data.otherImage3) {
        getProduct.data.otherImage3 ? imageDeleteHandler(getProduct.data.otherImage3) : '';
    }
    const product = await CrudService.update({
        modelData: {
            Model: PRODUCT,
            select: [],
        },
        data,
        filter: { id: productId },
    });
    return product;
}
export async function deleteProduct(productId) {
    const getProduct = await CrudService.getOne({
        modelData: {
            Model: PRODUCT,
            select: [],
        },
        data: { id: productId }, populate: {}
    });
    if (!getProduct.success || !getProduct.data) {
        throw new ApiError(404, 'Product not found');
    }
    getProduct.data.image ? imageDeleteHandler(getProduct.data.image) : '';
    getProduct.data.otherImage1 ? imageDeleteHandler(getProduct.data.otherImage1) : '';
    getProduct.data.otherImage2 ? imageDeleteHandler(getProduct.data.otherImage2) : '';
    getProduct.data.otherImage3 ? imageDeleteHandler(getProduct.data.otherImage3) : '';
    const getProductVariant = await CrudService.getMany({
        modelData: {
            Model: PRODUCT_VARIANT,
            select: [],
        },
        filter: { productId: productId }, populate: {}, query: {}
    });
    if (getProductVariant.success && getProductVariant.data) {
        for (const item of getProductVariant.data) {
            item.image ? imageDeleteHandler(item.image) : '';
        }
    }
    const product = await CrudService.delete({
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
export async function createProductVariant(data) {
    const productVariant = await CrudService.create({
        modelData: {
            Model: PRODUCT_VARIANT,
            select: [],
        },
        data,
        check: {},
    });
    return productVariant;
}
export async function getOneProductVariant(productVariantId) {
    const productVariant = await CrudService.getOne({
        modelData: {
            Model: PRODUCT_VARIANT,
            select: [],
        },
        data: { id: productVariantId },
        populate: {},
    });
    return productVariant;
}
export async function getManyProductVariant(query) {
    const productVariant = await CrudService.getMany({
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
export async function getManyProductVariantByProductId(productId, query = {}) {
    const productVariant = await CrudService.getMany({
        modelData: {
            Model: PRODUCT_VARIANT,
            select: [],
        },
        filter: { productId },
        populate: {},
        query,
    });
    return productVariant;
}
export async function updateProductVariant(productVariantId, data) {
    const getProductVariant = await CrudService.getOne({
        modelData: {
            Model: PRODUCT_VARIANT,
            select: [],
        },
        data: { id: productVariantId }, populate: {}
    });
    if (!getProductVariant.success || !getProductVariant.data) {
        throw new ApiError(404, 'Product Variant not found');
    }
    if (data.image) {
        getProductVariant.data.image ? imageDeleteHandler(getProductVariant.data.image) : '';
    }
    const productVariant = await CrudService.update({
        modelData: {
            Model: PRODUCT_VARIANT,
            select: [],
        },
        data,
        filter: { id: productVariantId },
    });
    return productVariant;
}
export async function deleteProductVariant(productVariantId) {
    const getProductVariant = await CrudService.getOne({
        modelData: {
            Model: PRODUCT_VARIANT,
            select: [],
        },
        data: { id: productVariantId }, populate: {}
    });
    if (!getProductVariant.success || !getProductVariant.data) {
        throw new ApiError(404, 'Product Variant not found');
    }
    getProductVariant.data.image ? imageDeleteHandler(getProductVariant.data.image) : '';
    const productVariant = await CrudService.delete({
        modelData: {
            Model: PRODUCT_VARIANT,
            select: [],
        },
        data: { id: productVariantId },
    });
    return productVariant;
}
//# sourceMappingURL=service.product.js.map