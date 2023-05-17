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
interface PosI extends Document {
  order_id: string;
  status: StatusE;
  type: SalesTypeE;
  original_amount: number;
  amount_sold: number;
  discount: number;
  sold_by: Types.objectId;
}
