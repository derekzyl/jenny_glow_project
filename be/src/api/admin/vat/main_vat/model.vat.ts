import { Schema, model } from "mongoose";
import { VatE, VatI } from "../interface_vat/vat";
import { time_stamps } from "../../../general_factory/interface/general_factory";

const vatSchema = new Schema<VatI>(
  {
    vat_percentage: Number,
    vat_name: {
      enum: VatE,
      unique: true,
      required: true,
      type: String,
    },
  },
  { timestamps: time_stamps }
);

export const VAT = model<VatI>("VAT", vatSchema);
