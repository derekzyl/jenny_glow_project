import { Document, Types } from "mongoose";

interface locationI {
  longitude: string;
  latitude: string;
}

type ProductCountT = {
  product: Types.ObjectId;
  amount_in_stock: number;
};

export enum BranchTypeE {
  ONLINE = "ONLINE",
  LOCAL = "LOCAL",
}
interface branchI extends Document {
  name: string;
  country: string;
  location: locationI;
  location_address: string;
  branch_type: BranchE;
  product: ProductCountT[];
  number_of_staff: number;
  created_at: Date;
  updated_at: Date;
}
