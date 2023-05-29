import { Types, Document } from "mongoose";

export interface AddressI {
  user: Types.ObjectId;
  address: string;
  phone: number;
  country: string;
  state: string;
  local_government: string;
  name: string;
  zip_code: string;
}

export interface AddressDocI extends Document, AddressI {}
