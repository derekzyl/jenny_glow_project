import { paginate } from "@modules/paginate";
import { Schema, model } from "mongoose";
import {
  DeliveryStatusE,
  DispatchDocI,
  DispatchModelI
} from "../interface_dispatch/interface.dispatch";
const dispatchSchema = new Schema<DispatchDocI, DispatchModelI>(
  {
    orderId: { type: String, required: true },
    trackingId: { type: String },
  
    dispatchedBy: { type: Schema.Types.ObjectId, ref: "USERS" },
    dispatchedTo: { type: Schema.Types.ObjectId, ref: "USERS" },

    dispatchCompany: {
      dispatchCompanyTrackId: { type: String },
      dispatchCompanyName: {
        type: String,
      },
    },

    dispatchedDate: Date,
    deliveryStatus: {
      type: String,
      enum: DeliveryStatusE,
      default: DeliveryStatusE.PENDING,
    },
    receivedDate: Date,
    dispatchInfo: {
      dispatchInfo: String,
      dispatchDate:Date
    }
  },
  { timestamps: true }
);

dispatchSchema.plugin(paginate)
export const DISPATCH = model("DISPATCH", dispatchSchema);
