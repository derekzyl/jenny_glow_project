import { Document, Types } from "mongoose";

interface locationI {
  longitude: string;
  latitude: string;
}

type ProductCountT = {
  product: Types.ObjectId;
  amount_in_stock: number;
};

interface branchI extends Document {
  name: string;
  location: locationI;
  location_address: string;
  product: ProductCountT[];
  number_of_staff: number;
  created_at: Date;
  updated_at: Date;
}
