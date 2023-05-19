import { Document, Types } from "mongoose";
enum StatusE {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

enum SalesTypeE {
  ONLINE_SALES = "ONLINE_SALES",
  STORE_SALES = "STORE_SALES",
}

enum OrderTypeE {
  WHOLESALE = "WHOLE_SALE",
  RETAIL = "RETAIL",
}

type ProductT = {
  product: Types.ObjectId;
  quantity_of_product: number;
  total: number;
};

// type MessageT = {
//   date: Date;
//   message: string;
// };

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
  product: ProductT[];
  vat: number;
  total_amount: number;
  order_type: OrderTypeE;
  order_id: string;
  status: StatusE;
  sold_by: Types.objectId;
  type: SalesTypeE;
  original_amount: number;
  amount_sold: number;
  discount: number;
}
