//create a stock service
import { ApiError } from "../../errors";
import { notificationService } from "../../notification";
import { allPermissions } from "../../setting/roles";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";
import { STOCK } from "../model/stock.model";
export async function createStock(data) {
    var _a;
    const newStock = await CrudService.create({
        check: { product: data.productId, branch: data.branchId },
        data, modelData: {
            Model: STOCK,
            select: ['-__v'],
        },
    });
    await notificationService.sendNotificationToStaffs({
        title: 'New Stock',
        body: `New stock has been added for ${data.productId} in ${data.branchId} stock id ~${(_a = newStock['data']) === null || _a === void 0 ? void 0 : _a.id}~`,
        type: 'info', permissions: [allPermissions.Admin, allPermissions.SuperAdmin],
        nType: 'both',
    });
    return newStock;
}
export async function addToStock(data) {
    const getStock = await STOCK.findOne({ productId: data.productId, branchId: data.branchId });
    if (!getStock) {
        throw new ApiError(httpStatus.NOT_FOUND, `Stock not found for product ${data.productId} in branch ${data.branchId}`);
    }
    if (data.productVariant) {
        let total = 0;
        data.productVariant.forEach((variant) => {
            total += variant.variantCount;
        });
        if (total > data.amount) {
            throw new ApiError(httpStatus.BAD_REQUEST, `Total variant count is greater than the amount you want to add`);
        }
        data.productVariant.forEach((variant) => {
            var _a, _b;
            const variantIndex = (_a = getStock.productVariant) === null || _a === void 0 ? void 0 : _a.findIndex((item) => item.productVariantId === variant.productVariantId);
            if (variantIndex === -1) {
                (_b = getStock.productVariant) === null || _b === void 0 ? void 0 : _b.push(variant);
            }
            else {
                if (getStock.productVariant && variantIndex && getStock.productVariant[variantIndex]) {
                    if (getStock.productVariant && variantIndex !== -1) {
                        getStock.productVariant[variantIndex].variantCount += variant.variantCount;
                    }
                }
            }
        });
    }
    getStock.amountInStock += data.amount;
    await getStock.save();
    return getStock;
}
export async function removeStock(data) {
    const getStock = await STOCK.findOne({ productId: data.productId, branchId: data.branchId });
    if (!getStock) {
        throw new ApiError(httpStatus.NOT_FOUND, `Stock not found for product ${data.productId} in branch ${data.branchId}`);
    }
    if (getStock.amountInStock < data.amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Stock is less than the amount you want to remove`);
    }
    if (data.productVariant) {
        let total = 0;
        data.productVariant.forEach((variant) => {
            total += variant.variantCount;
        });
        if (total > data.amount) {
            throw new ApiError(httpStatus.BAD_REQUEST, `Total variant count is greater than the amount you want to remove`);
        }
        data.productVariant.forEach((variant) => {
            var _a;
            const variantIndex = (_a = getStock.productVariant) === null || _a === void 0 ? void 0 : _a.findIndex((item) => item.productVariantId === variant.productVariantId);
            if (variantIndex === -1) {
                throw new ApiError(httpStatus.NOT_FOUND, `Variant not found for product ${data.productId}`);
            }
            if (getStock.productVariant && variantIndex && getStock.productVariant[variantIndex] && variantIndex !== -1) {
                if (getStock.productVariant[variantIndex].variantCount < variant.variantCount)
                    throw new ApiError(httpStatus.BAD_REQUEST, `Variant count is less than the amount you want to remove`);
                getStock.productVariant[variantIndex].variantCount -= variant.variantCount;
            }
        });
    }
    getStock.amountInStock -= data.amount;
    await getStock.save();
    return getStock;
}
export function updateStock(id, data) {
    const stock = CrudService.update({
        data,
        modelData: {
            Model: STOCK,
            select: [],
        },
        filter: { id },
    });
    return stock;
}
export function deleteStock(id) {
    const stock = CrudService.delete({
        data: { id },
        modelData: {
            Model: STOCK,
            select: [],
        },
    });
    return stock;
}
export function getStock(id) {
    const stock = CrudService.getOne({
        data: { id },
        modelData: {
            Model: STOCK,
            select: [],
        },
        populate: { fields: ['product'], },
    });
    return stock;
}
export function getAllStock(query, filter = {}) {
    const stock = CrudService.getMany({
        query,
        modelData: {
            Model: STOCK,
            select: [],
        },
        populate: {},
        filter,
    });
    return stock;
}
export async function getStockFromProductIdAndBranchId(productId, branchId) {
    const stock = await CrudService.getOne({
        data: { productId, branchId },
        modelData: {
            Model: STOCK,
            select: [],
        },
        populate: {},
    });
    return stock;
}
//# sourceMappingURL=services.stock.js.map