"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STAFF = void 0;
const mongoose_1 = require("mongoose");
const staffSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "USER",
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    address: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
    },
    bank_details: {
        bank_name: String,
        account_number: Number,
        account_name: String,
    },
    branch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BRANCH",
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
exports.STAFF = (0, mongoose_1.model)("STAFF", staffSchema);
