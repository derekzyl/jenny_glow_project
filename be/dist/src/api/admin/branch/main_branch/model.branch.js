"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRANCH = void 0;
const mongoose_1 = require("mongoose");
const branchSchema = new mongoose_1.Schema({
    name: { type: String, unique: true, required: true },
    location: { longitude: String, latitude: String },
    location_address: String,
    number_of_staff: Number,
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
