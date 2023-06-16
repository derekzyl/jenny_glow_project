import { Model, Types } from "mongoose";
import { SalesI } from "../../interface_sales/interface.sales";
import { ProductAndCount } from "../../../user/cart/interface_cart/interface.cart";

export enum MessageTypeE {
  TEXT = "TEXT",
  URL = "URL",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export type MessageT = {
  title: string;
  information: string;
  created_at: Date;
  updated_at: Date;
  read_receipt: boolean;
  message_type: MessageTypeE;
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
  user: Types.ObjectId;

  dispatch: {
    tracking_id: string;
    is_dispatched?: boolean;
    dispatched_by?: Types.ObjectId;
    company_track_id?: string;

    dispatched_at?: Date;
    received_at?: Date;
    delivery_status?: DeliveryStatusE;
  };

  message: MessageT[];
  date_ordered: Date;
}

export interface OnlineDocI extends OnlineI, Document {}
export type OnlineBodyT = {
  cart_items: Types.ObjectId[];
  address?: Types.ObjectId;
};

export interface OnlineModelI extends Model<OnlineDocI> {
  paymentStatus(): boolean;
}

// export type OnlineBodyT = Pick<OnlineI,  "address"| ""  |||||||||    >
