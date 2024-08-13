import { easyCreated } from "@modules/utils/created";
import { Schema, model } from "mongoose";
import {
  InventoryDocI,
  InventoryItemsDocI
} from "../interface_inventory/interface.inventory";

const inventorySchema = new Schema<InventoryDocI>(

   
  {
    name: {
      type: String, required: true
    }, 
    refId: {
      type: String,
      required: true
    },

    currency: {
      type: String,
      required: true
    },
    totalInventoryItems: {
      type: Number,
      required: true
    
    },
    totalInventoryPrice: {
      type: Number,
      required: true
    },
    inventoryReceipt: {
      type: String,
      required: true
    },
    inventoryStatus: {
      type: String,
      required: true
    },
    remarks: {
      type: String,
      required: true
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: "BRANCH",
      required: true
    },
    ...easyCreated
  },
  { timestamps: true }
);

const inventoryItemSchema = new Schema<InventoryItemsDocI>(
  {
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
  },
  { timestamps: true }
);

export const INVENTORY = model<InventoryDocI>("INVENTORY", inventorySchema);
export const INVENTORY_ITEM = model<InventoryItemsDocI>(
  "INVENTORY_ITEM",
  inventoryItemSchema
);