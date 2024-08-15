import { Schema, model } from "mongoose";
import { easyCreated } from "../../../utils/created";
const campaignSchema = new Schema(Object.assign({ product: { type: Schema.Types.ObjectId, ref: "PRODUCT" }, isActive: { type: Boolean, default: false } }, easyCreated), { timestamps: true });
export const SLIDER = model("SLIDER", campaignSchema);
const sliderSchema = new Schema(Object.assign({ image: String, isActive: { type: Boolean, default: false }, name: { type: String }, information: { type: String } }, easyCreated), { timestamps: true });
export const CAMPAIGN = model("CAMPAIGN", sliderSchema);
//# sourceMappingURL=model.campaign.js.map