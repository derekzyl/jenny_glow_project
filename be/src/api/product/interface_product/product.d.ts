import { Types, Document } from "mongoose";

interface ProductI extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: Types.ObjectId;
  sub_category;
  number_in_stock: number;
  rating: number;
  number_of_reviews: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
