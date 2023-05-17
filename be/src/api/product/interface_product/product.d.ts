import { Types, Document } from "mongoose";

interface ProductI extends Document {
  name: string;
  description: string;
  review: Types.ObjectId[];
  category: Types.ObjectId;
  sub_category: Types.ObjectId;
  created_by: Types.ObjectId;
  price: number;
  image: string;
  other_image: string[];
  number_in_stock: number;
  number_of_reviews: number;
  tags: string[];
}

interface ProductBodyI extends Document {
  name: string;
  description: string;
  review: Types.ObjectId[];
  category: Types.ObjectId;
  sub_category: Types.ObjectId;
  price: number;
  image: string;
  other_image: string[];
  number_in_stock: number;
  number_of_reviews: number;
  tags: string[];
}
