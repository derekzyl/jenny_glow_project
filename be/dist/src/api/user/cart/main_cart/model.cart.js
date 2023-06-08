"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CART = void 0;
const mongoose_1 = require("mongoose");
const general_factory_1 = require("../../../general_factory/interface/general_factory");
const cartSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "USER" },
    products: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: "PRODUCT",
            },
            product_total_count: { type: Number },
            product_total_price: { type: Number },
            shipping_fee: { type: Number },
        },
    ],
    sub_total: { type: Number },
    total_shipping_fee: { type: Number },
    vat: { type: Number },
    total_price: { type: Number },
}, { timestamps: general_factory_1.time_stamps });
exports.CART = (0, mongoose_1.model)("CART", cartSchema);
