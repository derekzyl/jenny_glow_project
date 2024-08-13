import { Schema, model } from "mongoose";

import { easyCreated } from "@modules/utils/created";
import {
  CampaignDocI,
  SliderDocI,
} from "../interface_campaigns/interface.campaign";

const campaignSchema = new Schema<SliderDocI>(
  {
    product: { type: Schema.Types.ObjectId, ref: "PRODUCT" },
    isActive: { type: Boolean, default: false },
    ...easyCreated
  },
  { timestamps: true }
);

export const SLIDER = model("SLIDER", campaignSchema);

const sliderSchema = new Schema<CampaignDocI>(
  {
    image: String,
    isActive: { type: Boolean, default: false },
    name: { type: String },
    information: { type: String },
    ...easyCreated
  },
  { timestamps: true}
);

export const CAMPAIGN = model("CAMPAIGN", sliderSchema);
