import { Model } from "mongoose";

export interface OnlineI {
  order_id: string;
  status: StatusE;
  type: SalesTypeE;
  original_amount: number;
  amount_sold: number;
  discount: number;
  sold_by: Types.objectId;
  product: {
    product: Types.ObjectId;
    quantity: number;
    total: number;
  };
  dispatch: {
    is_dispatched: boolean;
    dispatched_by: Types.objectId;
    dispatched_at: Date;
  };

  is_delivered: boolean;
  message: MessageT[];
}

export interface OnlineDocI extends OnlineI, Document {}

export interface OnlineModel extends Model<OnlineDocI> {
  paymentStatus(): boolean;
}
