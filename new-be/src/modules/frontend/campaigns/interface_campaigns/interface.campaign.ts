import { Document, Types } from "mongoose";
export interface CampaignI {
  image: string;
  isActive: boolean;
  name: string;
  information: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

export interface CampaignDocI extends CampaignI, Document {}

export type CampaignBodyT = CampaignI;

export interface SliderI {
  product: Types.ObjectId;
  isActive: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

export interface SliderDocI extends SliderI, Document {}

export type SliderBodyT = SliderI;
