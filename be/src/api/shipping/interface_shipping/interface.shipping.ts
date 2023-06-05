import { Document, Model } from "mongoose";

export interface ShippingI {
  country: string;
  country_shipping_fee: number;
  states: [{ name: string; state_shipping_fee: number }];
}

export interface ShippingDocI extends ShippingI, Document {}
export interface ShippingModel extends Model<ShippingDocI> {
  makeUppercase(): void;
}
