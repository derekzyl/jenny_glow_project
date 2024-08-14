import { Document, Model, Types } from "mongoose";

export interface AddressI {
  userId: Types.ObjectId;
  address: string;
  phone: string;
  country: string;
  state: string;
  localGovernment: string;
  name: string;
  zipCode: string;
  isDefault: boolean;
}

export interface AddressDocI extends Document, AddressI {}
export interface AddressModelI extends Model<AddressDocI> {
  checkDefaultAddress(): void;
}

export type AddressBodyT = Omit<AddressI, "user">;
