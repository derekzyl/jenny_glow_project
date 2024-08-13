import mongoose from "mongoose";
import { StockTransferDocument, StockTransferModel } from "../interface/interface.stock_transfer";

const stockTransferSchema = new mongoose.Schema<StockTransferDocument, StockTransferModel>({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'PRODUCT', required: true },
            productTotalCount: { type: Number, required: true }
        }
    ],
    note: { type: String },
    toBranchStatus: { type: Boolean, required: true, default: false },
    fromBranchStatus: { type: Boolean, required: true, default: false },
    fromBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'BRANCH', required: true },
    toBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'BRANCH', required: true },
    transferStatus: { type: String, required: true },
    transferType: { type: String, required: true }
}, { timestamps: true });


stockTransferSchema.statics["isProductInStock"] = async function (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId) {
    const product = await this.findOne({ products: { $elemMatch: { product: productId }, fromBranch: branchId } });
    return product ? true : false;
}

stockTransferSchema.statics["isProductInStockForTransfer"] = async function (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId, productTotalCount: number) {
    const product = await this.findOne({ products: { $elemMatch: { product: productId, productTotalCount: { $gte: productTotalCount } }, fromBranch: branchId } });
    return product ? true : false;
}

stockTransferSchema.statics["isProductInStockForTransferFromBranch"] = async function (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId, productTotalCount: number) {
    const product = await this.findOne({ products: { $elemMatch: { product: productId, productTotalCount: { $gte: productTotalCount } }, fromBranch: branchId } });
    return product ? true : false;
}

stockTransferSchema.statics["isProductInStockForTransferToBranch"] = async function (productId: mongoose.Types.ObjectId, branchId: mongoose.Types.ObjectId, productTotalCount: number) {
    const product = await this.findOne({ products: { $elemMatch: { product: productId, productTotalCount: { $gte: productTotalCount } }, toBranch: branchId } });
    return product ? true : false;
}




export const STOCK_TRANSFER = mongoose.model<StockTransferDocument, StockTransferModel>("STOCK_TRANSFER", stockTransferSchema);
  