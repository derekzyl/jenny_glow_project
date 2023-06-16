import { Types, Document } from "mongoose";

export interface ProductI {
  name: string;
  description: string;
  discount_percentage: number;
  reviews: Types.ObjectId[];
  category: Types.ObjectId;
  sub_category: Types.ObjectId;
  created_by: Types.ObjectId;
  price: number;
  image: string;
  weight: number;
  featured: boolean;
  available: boolean;
  other_image: string[];
  number_in_stock: number;
  number_of_reviews: number;
  search_tags: string[];
}

export interface ProductDocI extends ProductI, Document {}
export interface ProductBodyI {
  name: string;
  description: string;
  reviews: Types.ObjectId[];
  category: Types.ObjectId;
  sub_category: Types.ObjectId;
  price: number;
  image: string;
  other_image: string[];
  number_in_stock: number;
  number_of_reviews: number;
  search_tags: string[];
}
