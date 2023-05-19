import { Document, Types } from "mongoose";
import { OrderTypeE, ProductT, SalesTypeE } from "../../interface_sales/sales";

// interface PosI extends Document {
//   order_id: string;
//   status: StatusE;
//   type: SalesTypeE;
//   original_amount: number;
//   amount_sold: number;
//   discount: number;
//   sold_by: Types.objectId;
//   product: {
//     product: Types.ObjectId;
//     quantity: number;
//     total: number;
//   };
//   dispatch: {
//     is_dispatched: boolean;
//     dispatched_by: Types.objectId;
//     dispatched_at: Date;
//   };

//   is_delivered: boolean;
//   message: MessageT[];
// }

export interface PosI extends Document {
  order_id: string;
  product: ProductT[];
  order_type: OrderTypeE;

  status: StatusE;
  sold_by: Types.objectId;
  type: SalesTypeE;
  branch: Types.ObjectId;
  vat: number;
  original_amount: number;
  discount: number;
  total_amount: number;
  amount_sold: number;
}
