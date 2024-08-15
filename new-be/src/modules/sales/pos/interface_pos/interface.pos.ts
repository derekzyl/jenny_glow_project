import { Document } from "mongoose";
import {
  OrderTypeE,
  PaymentMethodE,
  PaymentStatusE,
  ProductT,
  SalesI,
} from "../../interface_sales/interface.sales";

export interface PosDocI extends Document, SalesI {}

export type PosDbI = SalesI;

export interface PosBodyI {
  products: ProductT[];
  order_type: OrderTypeE;
  payment_method: PaymentMethodE;

  payment_status: PaymentStatusE;

  original_amount: number;
  discount: number;
  total_amount: number;

  amount_sold: number;
}
