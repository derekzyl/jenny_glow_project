import { model, Schema } from "mongoose";
const stockSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'PRODUCT', required: true },
    amountInStock: { type: Number, required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'BRANCH', required: true },
    stockType: { type: String, required: true },
    productVariant: [{
            productVariantId: {
                type: Schema.Types.ObjectId,
                ref: 'PRODUCT_VARIANT',
            },
            variantCount: {
                type: Number,
            },
        }],
}, { timestamps: true });
stockSchema.statics["isProductInStock"] = async function (productId, branchId) {
    const product = await this.findOne({ product: productId, branch: branchId });
    return product ? true : false;
};
stockSchema.statics['isProductInStockForTransfer'] = async function (productId, branchId, productTotalCount) {
    const product = await this.findOne({ product: productId, branch: branchId, amount_in_stock: { $gte: productTotalCount } });
    return product ? true : false;
};
stockSchema.statics["isProductInStockForTransferFromBranch"] = async function (productId, branchId, productTotalCount) {
    const product = await this.findOne({ product: productId, branch: branchId, amount_in_stock: { $gte: productTotalCount } });
    return product ? true : false;
};
export const STOCK = model("STOCK", stockSchema);
//# sourceMappingURL=stock.model.js.map