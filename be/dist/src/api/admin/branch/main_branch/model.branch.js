"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRANCH = void 0;
const mongoose_1 = require("mongoose");
const interface_branch_1 = require("../interface_branch/interface.branch");
const branchSchema = new mongoose_1.Schema({
    name: { type: String, unique: true, required: true },
    location: { longitude: String, latitude: String },
    location_address: String,
    country: String,
    number_of_staff: Number,
    product: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "PRODUCT",
            },
            amount_in_stock: Number,
        },
    ],
    branch_type: {
        type: String,
        enum: interface_branch_1.BranchTypeE,
        default: interface_branch_1.BranchTypeE.LOCAL,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    },
});
branchSchema.pre("save", function () {
    this.name = String(this.name).toLocaleUpperCase();
});
exports.BRANCH = (0, mongoose_1.model)("BRANCH", branchSchema);
