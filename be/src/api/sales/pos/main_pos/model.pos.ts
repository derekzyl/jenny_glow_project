import { Schema } from "mongoose";
import { PosI } from "../interface_pos/pos";
import {
  OrderStatusE,
  OrderTypeE,
  PaymentMethodE,
  PaymentStatusE,
  SalesTypeE,
} from "../../interface_sales/sales";

const posSchema = new Schema<PosI>({
  order_id: { type: String },
  product: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "PRODUCT",
      },
      quantity_of_product: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  order_type: {
    type: String,
    enum: OrderTypeE,
  },
  payment_method: {
    type: String,
    enum: PaymentMethodE,
  },
  order_status: {
    type: String,
    enum: OrderStatusE,
  },
  payment_status: {
    type: String,
    enum: PaymentStatusE,
  },
  sold_by: {
    type: Schema.Types.ObjectId,
    ref: "USER",
  },
  sales_type: {
    type: String,
    enum: SalesTypeE,
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "BRANCH",
  },
  vat: {
    type: Schema.Types.ObjectId,
    ref: "VAT",
  },
});
