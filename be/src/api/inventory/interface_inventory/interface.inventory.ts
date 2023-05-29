import { Document, Types } from "mongoose";

type ProductT = {
  product: Types.ObjectId;
  quantity: number;
};

export interface InventoryI extends Document {
  name: string;
  date_created: Date;
  inventory_id: string;
  products: ProductT[];
  inventory_receipt?: string;
}

export interface DistributeInventoryI extends Document, InventoryI {
  branch: Types.ObjectId;
}

export interface InventoryBodyI {
  inventory_id: string;
  products: ProductT[];
  inventory_receipt?: string;
}

export interface DistributeInventoryBodyI extends InventoryI {
  branch: Types.ObjectId;
}
