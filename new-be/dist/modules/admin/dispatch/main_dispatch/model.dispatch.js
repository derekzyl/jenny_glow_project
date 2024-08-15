import { paginate } from "../../../paginate";
import { Schema, model } from "mongoose";
import { DeliveryStatusE } from "../interface_dispatch/interface.dispatch";
const dispatchSchema = new Schema({
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
        dispatchDate: Date
    }
}, { timestamps: true });
dispatchSchema.plugin(paginate);
export const DISPATCH = model("DISPATCH", dispatchSchema);
//# sourceMappingURL=model.dispatch.js.map