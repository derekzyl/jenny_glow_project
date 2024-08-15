import { easyCreated } from "../../utils/created";
import { Schema, model } from "mongoose";
const inventorySchema = new Schema(Object.assign({ name: {
        type: String, required: true
    }, refId: {
        type: String,
        required: true
    }, currency: {
        type: String,
        required: true
    }, totalInventoryItems: {
        type: Number,
        required: true
    }, totalInventoryPrice: {
        type: Number,
        required: true
    }, inventoryReceipt: {
        type: String,
        required: true
    }, inventoryStatus: {
        type: String,
        required: true
    }, remarks: {
        type: String,
        required: true
    }, branchId: {
        type: Schema.Types.ObjectId,
        ref: "BRANCH",
        required: true
    } }, easyCreated), { timestamps: true });
const inventoryItemSchema = new Schema({
    inventoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "INVENTORY",
    },
    name: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    remarks: {
        type: String,
        required: true,
    }
}, { timestamps: true });
export const INVENTORY = model("INVENTORY", inventorySchema);
export const INVENTORY_ITEM = model("INVENTORY_ITEM", inventoryItemSchema);
//# sourceMappingURL=model.inventory.js.map