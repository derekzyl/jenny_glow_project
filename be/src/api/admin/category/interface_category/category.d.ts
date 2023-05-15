import { Document, Types } from "mongoose";

interface categoryI extends Document {
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface subCategoryI extends Document {
  category: Types.ObjectId;
  name: string;
  created_at: Date;
  updated_at: Date;
}
