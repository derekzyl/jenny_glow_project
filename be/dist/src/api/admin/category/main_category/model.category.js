"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUB_CATEGORY = exports.CATEGORY = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    },
});
const subCategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, uppercase: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "CATEGORY", required: true },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    },
});
categorySchema.pre("save", function () {
    this.name = this.name.trim().toLocaleUpperCase();
});
subCategorySchema.pre("save", function () {
    this.name = this.name.trim().toLocaleUpperCase();
});
exports.CATEGORY = (0, mongoose_1.model)("CATEGORY", categorySchema);
exports.SUB_CATEGORY = (0, mongoose_1.model)("SUB_CATEGORY", subCategorySchema);
