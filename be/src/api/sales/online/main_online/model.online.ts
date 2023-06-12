import { Schema, model } from "mongoose";
import {
  DeliveryStatusE,
  OnlineDocI,
  OnlineModelI,
} from "../interface_online/interface.online";
import {
  OrderTypeE,
  PaymentMethodE,
  PaymentStatusE,
  SalesTypeE,
} from "../../interface_sales/interface.sales";
import { time_stamps } from "../../../general_factory/interface/general_factory";

export const onlineSchema = new Schema<OnlineDocI, OnlineModelI>(
  {
    order_id: { type: String, required: true, unique: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "PRODUCT",
        },
        product_total_count: { type: Number },
        product_total_price: { type: Number },
        shipping_fee: { type: Number },
      },
    ],
    branch: {
      type: Schema.Types.ObjectId,
      ref: "BRANCH",
    },
    order_type: {
      type: String,
      enum: OrderTypeE,
      default: OrderTypeE.RETAIL,
    },
    payment_method: {
      type: String,
      enum: PaymentMethodE,
      default: PaymentMethodE.CREDIT_CARD,
    },
    payment_status: {
      type: String,
      enum: PaymentStatusE,
      default: PaymentStatusE.INITIALIZED,
    },
    sold_by: {
      type: Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    sales_type: {
      type: String,
      enum: SalesTypeE,
      default: SalesTypeE.ONLINE_SALES,
    },

    vat: { type: Number },
    discount: { type: Number },
    total_amount: { type: Number },
    original_amount: { type: Number },
    amount_sold: { type: Number },
    server_amount_sold: { type: Number },
    server_total: { type: Number },

    address: {
      type: Schema.Types.ObjectId,
      ref: "ADDRESS",
      required: true,
    },
    message: [
      {
        title: { type: String },
        text: { type: String },
        created_at: { type: Date },
        updated_at: { type: Date },
      },
    ],
    dispatch: {
      tracking_id: { type: String },
      is_dispatched: { type: Boolean, default: false },
      dispatched_by: { type: Schema.Types.ObjectId, ref: "USER" },
      dispatched_at: Date,
      delivery_status: {
        type: String,
        enum: DeliveryStatusE,
        default: DeliveryStatusE.PENDING,
      },
      received_at: Date,
    },
  },
  { timestamps: time_stamps }
);

export const ONLINE_ORDER = model("ONLINE_ORDER", onlineSchema);
