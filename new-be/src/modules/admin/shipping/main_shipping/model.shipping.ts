import { easyCreated } from "@modules/utils/created";
import { Schema, model } from "mongoose";
import {
  ShippingDocI,
  ShippingModelI,
} from "../interface_shipping/interface.shipping";
import { fetchCountres } from "./controller.shipping";

const shippingSchema = new Schema<ShippingDocI, ShippingModelI>(
  {
    country: { type: String, required: true, uppercase: true },
    ...easyCreated,
    countryShippingFee: {
      type: Number,
      required: true,
      uppercase: true,
      unique: true,
    },
    useCountryShippingFeeAsDefault: {
      type: Boolean,
      required: true,
      default: false,
    },

    states: [
      {
        name: { type: String, uppercase: true, unique: true },
        stateShippingFee: { type: Number },
      },
    ],
  },
  { timestamps: true }
);
shippingSchema.pre("save", function () {
  if (this.useCountryShippingFeeAsDefault === true &&!this.states) {

    const country = fetchCountres();
    const states = country.find((c) => c.name.toLowerCase() === this.country.toLowerCase())?.states;
    if (states) {
      states.map((state) => { 
        this.states.push({
          name: state.name, stateShippingFee: this.countryShippingFee
        })
      })
    }
  }
});
export const SHIPPING = model("SHIPPING", shippingSchema);
