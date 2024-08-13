import { GeneralStatus } from "@modules/utils/utils";
import mongoose from "mongoose";



export interface StockTransferI{
    products: [
        {
            product: mongoose.Types.ObjectId;
            productTotalCount: number;
           
        }
    ];
    fromBranch: mongoose.Types.ObjectId;
    toBranch: mongoose.Types.ObjectId;
    toBranchStatus: boolean;
    fromBranchStatus: boolean;
    transferStatus: GeneralStatus;
    note: string;
    transferType: string;

    
 }




export interface StockTransferDocument extends mongoose.Document, StockTransferI { }

export interface StockTransferModel extends mongoose.Model<StockTransferDocument> {
    isProductInStock (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId): Promise<boolean>;
    isProductInStockForTransfer (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId, productTotalCount: number): Promise<boolean>;
    isProductInStockForTransferFromBranch (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId, productTotalCount: number): Promise<boolean>;
    isProductInStockForTransferToBranch (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId, productTotalCount: number): Promise<boolean>;
    isBranchHasEnoughStock (branchId: mongoose.Types.ObjectId, products: Array<{ product: mongoose.Types.ObjectId, productTotalCount: number }>): Promise<boolean>;
}

export type UpdateStockTransferBody = Partial<Omit<StockTransferI, 'fromBranch' | 'toBranch' | 'transferStatus' | 'transferType'>>;
export type NewStockTransfer = Omit<StockTransferI, 'fromBranch' | 'toBranch' | 'transferStatus' | 'transferType'> & {
    fromBranch: mongoose.Types.ObjectId;
    toBranch: mongoose.Types.ObjectId;
    transferStatus: string;
    transferType: string;
};
