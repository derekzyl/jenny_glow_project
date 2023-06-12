import { Schema } from "mongoose";
import { OnlineDocI, OnlineModelI } from "../interface_online/interface.online";

export const onlineSchema = new Schema<OnlineDocI, OnlineModelI>({
  order_id: { type: String, required: true },
  products: [{ p }],
});
g;
