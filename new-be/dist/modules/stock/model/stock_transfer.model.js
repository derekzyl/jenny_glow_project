import { easyCreated } from "../../utils/created";
import mongoose from "mongoose";
const stockTransferSchema = new mongoose.Schema(Object.assign({ products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'PRODUCT', required: true },
            productTotalCount: { type: Number, required: true },
            variant: [
                {
                    variantId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'PRODUCT_VARIANT',
                    },
                    variantCount: {
                        type: Number,
                    },
                }
            ]
        }
    ], note: { type: String }, toBranchStatus: { type: Boolean, required: true, default: false }, fromBranchStatus: { type: Boolean, required: true, default: false }, fromBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'BRANCH', required: true }, toBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'BRANCH', required: true }, transferStatus: { type: String, required: true }, transferType: { type: String, required: true } }, easyCreated), { timestamps: true });
stockTransferSchema.statics["isProductInStock"] = async function (productId, branchId) {
    const product = await this.findOne({ products: { $elemMatch: { product: productId }, fromBranch: branchId } });
    return product ? true : false;
};
stockTransferSchema.statics["isProductInStockForTransfer"] = async function (productId, branchId, productTotalCount) {
    const product = await this.findOne({ products: { $elemMatch: { product: productId, productTotalCount: { $gte: productTotalCount } }, fromBranch: branchId } });
    return product ? true : false;
};
stockTransferSchema.statics["isProductInStockForTransferFromBranch"] = async function (productId, branchId, productTotalCount) {
    const product = await this.findOne({ products: { $elemMatch: { product: productId, productTotalCount: { $gte: productTotalCount } }, fromBranch: branchId } });
    return product ? true : false;
};
stockTransferSchema.statics["isProductInStockForTransferToBranch"] = async function (productId, branchId, productTotalCount) {
    const product = await this.findOne({ products: { $elemMatch: { product: productId, productTotalCount: { $gte: productTotalCount } }, toBranch: branchId } });
    return product ? true : false;
};
export const STOCK_TRANSFER = mongoose.model("STOCK_TRANSFER", stockTransferSchema);
//# sourceMappingURL=stock_transfer.model.js.map