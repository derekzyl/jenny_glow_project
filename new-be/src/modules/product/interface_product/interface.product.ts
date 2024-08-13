import { Document, Types } from "mongoose";

export interface ProductI {
  name: string;
  description: string;
  discount: number;
  category: Types.ObjectId;
  subCategory: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  price: number;
  image: string;
  size: number;
  unit: string;
  featured: boolean;
  otherImage1?: string | undefined;
  otherImage2?: string | undefined;
  otherImage3?: string | undefined;

  searchTags: string[]; // this will be generated from the name and description


}

export interface ProductVariantI{
   
  type: string;
  size: string;
  price: number;
  image: string;
  productId: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}
export interface ProductVariantDocI extends ProductVariantI, Document { }

export type ProductVariantBodyI = Omit<ProductVariantI,"productId"| "createdBy"|"updatedBy">;

export interface ProductDocI extends ProductI, Document { }

export type ProductBodyI = Omit<ProductI, "createdBy"|"updatedBy"|"searchTags"> & {
  productVariant: ProductVariantBodyI[];
};
