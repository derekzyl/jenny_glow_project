//create a stock service

import { ApiError } from "@modules/errors";
import { notificationService } from "@modules/notification";
import { allPermissions } from "@modules/setting/roles";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";
import { FilterQuery, Types } from "mongoose";
import { NewStock, StockI } from "../interface/interface.stock";
import { STOCK } from "../model/stock.model";

export async function createStock (data:NewStock) {
     const newStock =await  CrudService.create<StockI>({
       check: { product: data.productId, branch: data.branchId },
       data,       modelData: {
         Model: STOCK,
         select: ['-__v'],
       },
     });
  
  await notificationService.sendNotificationToStaffs({
    title: 'New Stock',
    body: `New stock has been added for ${data.productId} in ${data.branchId} stock id ~${newStock['data']?.id}~`,
    type: 'info', permissions: [allPermissions.Admin, allPermissions.SuperAdmin],
    nType: 'both',
  })

     return newStock;
}

export async function addToStock(
  data: Pick<NewStock, 'productId' | 'stockType'> & {
    branchId: Types.ObjectId;
    amount: number;
    productVariant?:
      | {
          productVariantId: Types.ObjectId;
          variantCount: number;
        }[]
      | undefined;
  }
) {
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
      const variantIndex = getStock.productVariant?.findIndex((item) => item.productVariantId === variant.productVariantId);
      if (variantIndex === -1) {
        getStock.productVariant?.push(variant);
      } else {
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

export async function removeStock(
  data: Pick<NewStock, 'productId' | 'stockType'> & {
    branchId: Types.ObjectId;
    amount: number;
    productVariant?: {
      productVariantId: Types.ObjectId;
      variantCount: number;
    }[]|undefined;
  }
) {
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
      const variantIndex = getStock.productVariant?.findIndex((item) => item.productVariantId === variant.productVariantId);
      if (variantIndex === -1) {
        throw new ApiError(httpStatus.NOT_FOUND, `Variant not found for product ${data.productId}`);
      }
      if (getStock.productVariant && variantIndex && getStock.productVariant[variantIndex] && variantIndex !== -1) {
        if (getStock.productVariant[variantIndex].variantCount<variant.variantCount) throw new ApiError(httpStatus.BAD_REQUEST, `Variant count is less than the amount you want to remove`);
          getStock.productVariant[variantIndex].variantCount -= variant.variantCount;
      }
    });
  }

  getStock.amountInStock -= data.amount;
  await getStock.save();
  return getStock;
}



export function updateStock (id: Types.ObjectId, data: Partial<StockI>) {
    const stock = CrudService.update<StockI>({
        data,
        modelData: {
            Model: STOCK,
            select: [],
        },
        filter: { id },
    });

    return stock;
}
export function deleteStock (id: Types.ObjectId) { 

    const stock = CrudService.delete<StockI>({
        data: { id },
        modelData: {
            Model: STOCK,
            select: [],
        },
    });

    return stock;
}

export function getStock (id: Types.ObjectId) {
    const stock = CrudService.getOne<StockI>({
        data: { id },
        modelData: {
            Model: STOCK,
            select: [],
        },
        populate: {fields: ['product'],},
    });

    return stock;
 }
export function getAllStock(query: Record<string, any>, filter: FilterQuery<StockI >={}) {
  const stock = CrudService.getMany<StockI>({
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
 

export async function getStockFromProductIdAndBranchId(productId: Types.ObjectId, branchId: Types.ObjectId) {
    const stock =await CrudService.getOne<StockI>({
      data: { productId,  branchId },
        modelData: {
            Model: STOCK,
            select: [],
        },
        populate: {},
    });

    return stock;
}

