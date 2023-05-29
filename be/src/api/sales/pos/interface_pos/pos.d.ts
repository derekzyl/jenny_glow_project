import { Document, Types } from "mongoose";
import {
  OrderTypeE,
  PaymentMethodE,
  ProductT,
  SalesTypeE,
  PaymentStatusE,
  OrderStatusE,
} from "../../interface_sales/sales";



export interface PosI extends Document {
  order_id: string;
  product: ProductT[];
  order_type: OrderTypeE;
  payment_method: PaymentMethodE;
  order_status: OrderStatusE;
  payment_status: PaymentStatusE;
  sold_by: Types.objectId;
  sales_type: SalesTypeE;
  branch: Types.ObjectId;
  vat: number;
  server_total: number;
  original_amount: number;
  discount: number;
  total_amount: number;
  amount_sold: number;
  server_amount_sold: number;
}

export interface PosDbI {
  order_id: string;
  product: ProductT[];
  order_type: OrderTypeE;
  payment_method: PaymentMethodE;
  order_status: OrderStatusE;
  payment_status: PaymentStatusE;
  sold_by: Types.objectId;
  sales_type: SalesTypeE;
  branch: Types.ObjectId;
  vat: number;
  server_total: number;
  original_amount: number;
  discount: number;
  total_amount: number;
  amount_sold: number;
  server_amount_sold: number;
}

export interface PosBodyI {
  product: ProductT[];
  order_type: OrderTypeE;
  payment_method: PaymentMethodE;

  payment_status: PaymentStatusE;

  original_amount: number;
  discount: number;
  total_amount: number;

  amount_sold: number;
}
