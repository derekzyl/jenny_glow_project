import { Schema, model } from "mongoose";
import {
  DistributeInventoryI,
  InventoryI,
} from "../interface_inventory/interface.inventory";
import { time_stamps } from "../../general_factory/interface/general_factory";

const inventorySchema = new Schema<InventoryI>(
  {
    inventory_id: {
      type: String,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "PRODUCT",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    inventory_receipt: {
      type: String,
      required: true,
    },
  },
  { timestamps: time_stamps }
);

const branchInventorySchema = new Schema<DistributeInventoryI>(
  {
    inventory_id: {
      type: String,
      required: true,
    },
    branch: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "BRANCH",
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "PRODUCT",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    inventory_receipt: { type: String, required: true },
  },
  { timestamps: time_stamps }
);

export const INVENTORY = model<InventoryI>("INVENTORY", inventorySchema);
export const BRANCH_INVENTORY = model<InventoryI>(
  "BRANCH_INVENTORY",
  branchInventorySchema
);
