import mongoose from "mongoose";


export interface StockI{
    productId: mongoose.Types.ObjectId;
    amountInStock: number;
    branchId: mongoose.Types.ObjectId;
    stockType: string;
    stockStatus: string;

}

export interface stockDocument extends mongoose.Document, StockI { }

export interface stockModel extends mongoose.Model<stockDocument> {
    isProductInStock (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<boolean>;
    isProductInStockForTransfer (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId, productTotalCount: number): Promise<boolean>;
    isProductInStockForTransferFromBranch (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId, productTotalCount: number): Promise<boolean>;
    isProductInStockForTransferToBranch (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId, productTotalCount: number): Promise<boolean>;
    isBranchHasEnoughStock (branchId: mongoose.Types.ObjectId, products: Array<{ product: mongoose.Types.ObjectId, productTotalCount: number }>): Promise<boolean>;
}

export type UpdateStockBody = Partial<Omit<StockI, 'branch' | 'stockType'>>;
export type NewStock = Omit<StockI, 'branchId' | 'stockType'> & {
    branchId: mongoose.Types.ObjectId;
    stockType: string;
};
export type AddToStock = Pick<StockI, 'branchId' | 'productId'> & {
    amount:number
}