import { Model, Types } from "mongoose";
import { SalesI } from "../../interface_sales/interface.sales";

type MessageT = {
  title: string;
  text: string;
  created_at: Date;
  updated_at: Date;
};

export interface OnlineI extends SalesI {
  address: Types.ObjectId;
  dispatch: {
    is_dispatched: boolean;
    dispatched_by: Types.ObjectId;
    dispatched_at: Date;
  };

  is_delivered: boolean;
  message: MessageT[];
}

export interface OnlineDocI extends OnlineI, Document {}

export interface OnlineModelI extends Model<OnlineDocI> {
  paymentStatus(): boolean;
}

// export type OnlineBodyT = Pick<OnlineI,  "address"| ""  |||||||||    >
