import { model, Schema } from "mongoose";
import { stockDocument, stockModel } from "../interface/interface.stock";


const stockSchema = new Schema<stockDocument, stockModel>({

    productId: { type: Schema.Types.ObjectId, ref: 'PRODUCT', required: true },
    amountInStock: { type: Number, required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'BRANCH', required: true },
    stockType: { type: String, required: true }

}, { timestamps: true });

stockSchema.statics["isProductInStock"] = async function (productId: any, branchId: any) {
    const product = await this.findOne({ product: productId, branch: branchId });
    return product ? true : false;
}

stockSchema.statics['isProductInStockForTransfer'] = async function (
  productId: any,
  branchId: any,
  productTotalCount: any
) {
  const product = await this.findOne({ product: productId, branch: branchId, amount_in_stock: { $gte: productTotalCount } });
  return product ? true : false;
};

stockSchema.statics["isProductInStockForTransferFromBranch"] = async function (productId: any, branchId: any, productTotalCount: any) {
    const product = await this.findOne({ product: productId, branch: branchId, amount_in_stock: { $gte: productTotalCount } });
    return product ? true : false;
}


export const STOCK = model<stockDocument, stockModel>("STOCK", stockSchema);