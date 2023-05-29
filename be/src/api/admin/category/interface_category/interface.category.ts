import { Document, Types } from "mongoose";

export interface categoryI extends Document {
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface subCategoryI extends Document {
  category: Types.ObjectId;
  name: string;
  created_at: Date;
  updated_at: Date;
}
