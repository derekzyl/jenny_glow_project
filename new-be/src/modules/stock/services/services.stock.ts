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

export async  function addToStock (data: Pick<NewStock, "productId"|"stockType"> & {
  branchId: Types.ObjectId, amount: number
}) {

  const getStock = await STOCK.findOne({ productId: data.productId, branchId: data.branchId });
  if (!getStock) { 
    throw new ApiError(httpStatus.NOT_FOUND, `Stock not found for product ${data.productId} in branch ${data.branchId}`);
  }


  getStock.amountInStock += data.amount;

  await getStock.save();


  
  return getStock;
}

export async  function removeStock (data: Pick<NewStock, "productId"|"stockType"> & {
   branchId: Types.ObjectId, amount: number
}) {

  const getStock = await STOCK.findOne({ productId: data.productId, branchId: data.branchId });
  if (!getStock) { 
    throw new ApiError(httpStatus.NOT_FOUND, `Stock not found for product ${data.productId} in branch ${data.branchId}`);
  }
  if (getStock.amountInStock < data.amount) { 
    throw new ApiError(httpStatus.BAD_REQUEST, `Stock is less than the amount you want to remove`);
  }

  getStock.amountInStock -= data.amount;
  await getStock.save();
  return getStock;
}



export function updateStock (data: NewStock) {
    
    const newStock = CrudService.create<StockI>({
        check: { product: data.productId, branch: data.branchId }, data, modelData: {
    Model:STOCK, select:['-__v']
        }
    });
    

    return newStock;

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
        populate: {},
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

