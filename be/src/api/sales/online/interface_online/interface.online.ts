import { Model, Types } from "mongoose";
import { SalesI } from "../../interface_sales/interface.sales";
import { ProductAndCount } from "../../../user/cart/interface_cart/interface.cart";

type MessageT = {
  title: string;
  text: string;
  created_at: Date;
  updated_at: Date;
};
export enum DeliveryStatusE {
  RECEIVED_BY_CUSTOMER = "RECEIVED_BY_CUSTOMER",
  DISPATCHED = "DISPATCHED",
  ON_TRANSIT = "ON_TRANSIT",
  PENDING = "PENDING",
}
export interface OnlineI extends Omit<SalesI, "products"> {
  products: ProductAndCount[];
  address: Types.ObjectId;
  dispatch: {
    tracking_id: string;
    is_dispatched: boolean;
    dispatched_by: Types.ObjectId;
    dispatched_at: Date;
    received_at: Date;
    delivery_status: DeliveryStatusE;
  };

  message: MessageT[];
}

export interface OnlineDocI extends OnlineI, Document {}

export interface OnlineModelI extends Model<OnlineDocI> {
  paymentStatus(): boolean;
}

// export type OnlineBodyT = Pick<OnlineI,  "address"| ""  |||||||||    >
