import { Document, Types } from "mongoose";


export interface InventoryItemsI {
  name: string;
  inventoryId: Types.ObjectId;
  unitPrice: number;
  unit: string;
  size: string;


  quantity: number;
  totalPrice: number;
  remarks: string;


}

export interface InventoryItemsDocI extends InventoryItemsI, Document { }
export type createInventoryItemT = Omit<InventoryItemsI, 'inventoryId'>

export interface InventoryI {
  name: string;
  refId: string,
  createdBy: Types.ObjectId;
  currency: string;
  updatedBy: Types.ObjectId;

  totalInventoryItems: number;
  totalInventoryPrice: number;
  inventoryReceipt: string;
  inventoryStatus: string; // pending, approved, rejected
  remarks: string;
  branchId: Types.ObjectId;
}

export interface InventoryDocI extends InventoryI, Document { }
export type InventoryBodyT = Omit<InventoryI, 'createdBy'|"totalInventoryPrice"|"refId"|"inventoryStatus"|"updatedBy"> & {
  inventoryItems: InventoryItemsI[];
};



