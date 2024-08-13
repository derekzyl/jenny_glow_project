import { Document, Model, Types } from "mongoose";

export interface categoryI  {
  name: string;
  image: string;

  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;

}

export interface subCategoryI {
  image:string
  category: Types.ObjectId;
  name: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  

}


export interface categoryDocument extends categoryI, Document { }
export interface subCategoryDocument extends subCategoryI, Document { }


export interface categoryModelI extends Model<categoryDocument> { 

}

export interface subCategoryModelI extends Model<subCategoryDocument> { }