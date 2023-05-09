"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRANCH = void 0;
const mongoose_1 = require("mongoose");
const branchSchema = new mongoose_1.Schema({
    name: String,
    location: { longitude: String, latitude: String },
    location_address: String,
    number_of_staff: Number,
    created_at: Date,
    updated_at: Date,
});
exports.BRANCH = (0, mongoose_1.model)("BRANCH", branchSchema);
