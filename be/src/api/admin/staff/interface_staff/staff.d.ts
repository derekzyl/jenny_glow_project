import { Document, Types } from "mongoose";
import { PermissionsE } from "../../../general_factory/interface/general_factory";

interface BankDetailsI {
  bank_name: string;
  account_number: number;
  account_name: string;
}

interface StaffI extends Document {
  user: Types.ObjectId;
  first_name: string;
  last_name: string;
  address: string;
  username: string;
  branch: Types.ObjectId;
  bank_details?: bankDetailsI;
  created_at: Date;
  updated_at: Date;
}

interface StaffBodyI extends Document {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: Types.ObjectId;
  address: string;
  username: string;
  branch: Types.ObjectId;
  bank_details?: bankDetailsI;
  permissions: PermissionsE[];
}
