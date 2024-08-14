import { ApiError } from '@modules/errors';
import { notificationService } from '@modules/notification';
import { allPermissions } from '@modules/setting/roles';
import { transactionsService } from '@modules/transactions';
import { TrxCrudTypes, TrxTypes } from '@modules/transactions/interfaces/interfaces.transactions';
import { easyReferenceGenerator, GeneratePrefixType } from '@modules/utils/referenceGenerator';
import { GeneralStatus } from '@modules/utils/utils';
import { CrudService } from 'expressbolt';
import { Types } from 'mongoose';
import { stockService } from '..';
import { StockTransferI } from '../interface/interface.stock_transfer';
import { STOCK_TRANSFER } from '../model/stock_transfer.model';

export async function createStockTransfer(data: Omit<StockTransferI, 'toBranchStatus'>) {
  const stockTransfer = await CrudService.create<StockTransferI>({
    modelData: {
      Model: STOCK_TRANSFER,
      select: [],
    },
    data: { ...data, toBranchStatus: false },
    check: {},
  });

  return stockTransfer;
}

export async function getOneStockTransfer(stockTransferId: Types.ObjectId) {
  const stockTransfer = await CrudService.getOne<StockTransferI>({
    modelData: {
      Model: STOCK_TRANSFER,
      select: [],
    },
    data: { id: stockTransferId },
    populate: {},
  });

  return stockTransfer;
}

export async function getManyStockTransfer(query: Record<string, any>) {
  const stockTransfer = await CrudService.getMany<StockTransferI>({
    modelData: {
      Model: STOCK_TRANSFER,
      select: [],
    },
    filter: {},
    populate: {},
    query,
  });

  return stockTransfer;
}

export async function updateStockTransfer(stockTransferId: Types.ObjectId, data: Partial<StockTransferI>) {
  const stockTransfer = await CrudService.update<StockTransferI>({
    modelData: {
      Model: STOCK_TRANSFER,
      select: [],
    },
    filter: { id: stockTransferId },
    data,
  });

  return stockTransfer;
}

export async function deleteStockTransfer(stockTransferId: Types.ObjectId) {
  const stockTransfer = await CrudService.delete<StockTransferI>({
    modelData: {
      Model: STOCK_TRANSFER,
      select: [],
    },
    data: { id: stockTransferId },
  });

  return stockTransfer;
}

export async function isProductInStock(productId: string, branchId: string) {
  const product = await STOCK_TRANSFER.findOne({ products: { $elemMatch: { product: productId }, fromBranch: branchId } });

  return product ? true : false;
}

export async function isProductInStockForTransfer(productId: string, branchId: string, productTotalCount: number) {
  const product = await STOCK_TRANSFER.findOne({
    products: { $elemMatch: { product: productId, productTotalCount: { $gte: productTotalCount } }, fromBranch: branchId },
  });

  return product ? true : false;
}

export async function updateStockTransferStatus(stockTransferId: Types.ObjectId, status: GeneralStatus) {
  // lets get the stock transfer

  const stock = await STOCK_TRANSFER.findOne({ id: stockTransferId });
  if (!stock) throw new ApiError(404, 'Stock transfer not found');

  // lets update the products in stock

  let trxs = {
    trxType: TrxTypes.STOCK_TRANSFER,

    referenceId: stockTransferId.toString(),
    createdBy: stock.fromBranch,
    details: `Stock transfer from branch ${stock.fromBranch} to branch ${stock.toBranch}`,
    trxCrudType: TrxCrudTypes.UPDATE,
    trxRef: easyReferenceGenerator({ prefix: GeneratePrefixType.STOCK_TRANSFER }),
    amount: 0,
    status: status,
    items: stock.products,
    info1: {
      key: 'fromBranch',
      value: stock.fromBranch,
    },
    info2: {
      key: 'toBranch',
      value: stock.toBranch,
    },
    notes: `Stock transfer from branch ${stock.fromBranch} to branch ${stock.toBranch}`,
  };
  if (status === GeneralStatus.APPROVED) {
    const stk = stock.products.map(async (product) => {
      const senderStock = await stockService.getStockFromProductIdAndBranchId(product.product, stock.fromBranch);
      if (!senderStock.success || !senderStock.data)
        throw new ApiError(404, `Stock not found for product ${product.product} in branch ${stock.fromBranch}`);
      if (senderStock['data'].amountInStock < product.productTotalCount)
        throw new ApiError(400, `Stock is less than the amount you want to transfer`);
      await stockService.removeStock({
        branchId: stock.fromBranch,
        productId: product.product,
        amount: product.productTotalCount,
        stockType: 'TRANSFER',
        productVariant:product.productVariant
      });

      await stockService.addToStock({
        branchId: stock.toBranch,
        productId: product.product,
        amount: product.productTotalCount,
        stockType: 'TRANSFER',
        productVariant:product.productVariant
      });
    });
    await Promise.all(stk);

    trxs.amount = stock.products.reduce((acc, cur) => acc + cur.productTotalCount, 0);
    trxs.status = GeneralStatus.APPROVED;
  }

  await transactionsService.createTransaction(trxs);
  await notificationService.sendNotificationToStaffs({
    title: 'Stock Transfer',
    body: `Stock transfer from branch ${stock.fromBranch} to branch ${stock.toBranch} has been ${status}`,
    type: 'STOCK_TRANSFER',
      branchId: stock.fromBranch,
    permissions: [allPermissions.Admin, allPermissions.SuperAdmin, allPermissions.Stock.Transfer, allPermissions.Stock.Manage],
    nType: 'both',
  });
    
    await notificationService.sendNotificationToStaffs({
        title: 'Stock Transfer',
        body: `Stock transfer from branch ${stock.fromBranch} to branch ${stock.toBranch} has been ${status}`,
        type: 'STOCK_TRANSFER',
        branchId: stock.toBranch,
        permissions: [allPermissions.Admin, allPermissions.SuperAdmin, allPermissions.Stock.Transfer, allPermissions.Stock.Manage],
    nType: 'both',
    });

  const stockTransfer = await CrudService.update<StockTransferI>({
    modelData: {
      Model: STOCK_TRANSFER,
      select: [],
    },
    filter: { id: stockTransferId },
    data: { transferStatus: status, toBranchStatus: status === GeneralStatus.APPROVED ? true : false },
  });

  return stockTransfer;
}

export async function acceptStockTransferByBranch (stockTransferId: Types.ObjectId, 
    
) {
  // lets get the stock transfer

  const stock = await STOCK_TRANSFER.findOne({ id: stockTransferId });
  if (!stock) throw new ApiError(404, 'Stock transfer not found');

  // lets update the products in stock

  let trxs = {
    trxType: TrxTypes.STOCK_TRANSFER,

    referenceId: stockTransferId.toString(),
    createdBy: stock.fromBranch,
    details: `Stock transfer from branch ${stock.fromBranch} to branch ${stock.toBranch}`,
    trxCrudType: TrxCrudTypes.UPDATE,
    trxRef: easyReferenceGenerator({ prefix: GeneratePrefixType.STOCK_TRANSFER }),
    amount: 0,
    status: GeneralStatus.APPROVED,
    items: stock.products,
    info1: {
      key: 'fromBranch',
      value: stock.fromBranch,
    },
    info2: {
      key: 'toBranch',
      value: stock.toBranch,
    },
    notes: `Stock transfer from branch ${stock.fromBranch} to branch ${stock.toBranch}`,
  };

    const stk = stock.products.map(async (product) => {
      const senderStock = await stockService.getStockFromProductIdAndBranchId(product.product, stock.fromBranch);
      if (!senderStock.success || !senderStock.data)
        throw new ApiError(404, `Stock not found for product ${product.product} in branch ${stock.fromBranch}`);
      if (senderStock['data'].amountInStock < product.productTotalCount)
        throw new ApiError(400, `Stock is less than the amount you want to transfer`);
      await stockService.removeStock({
        branchId: stock.fromBranch,
        productId: product.product,
        amount: product.productTotalCount,
        stockType: 'TRANSFER',
        productVariant:product.productVariant
      });

      await stockService.addToStock({
        branchId: stock.toBranch,
        productId: product.product,
        amount: product.productTotalCount,
        stockType: 'TRANSFER',
        productVariant:product.productVariant
      });
    });
    await Promise.all(stk);

    trxs.amount = stock.products.reduce((acc, cur) => acc + cur.productTotalCount, 0);
    trxs.status = GeneralStatus.APPROVED;


  await transactionsService.createTransaction(trxs);

  const stockTransfer = await CrudService.update<StockTransferI>({
    modelData: {
      Model: STOCK_TRANSFER,
      select: [],
    },
    filter: { id: stockTransferId },
    data: { transferStatus: GeneralStatus.APPROVED, toBranchStatus: true },
  });

  return stockTransfer;
}


