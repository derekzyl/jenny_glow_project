import { Schema, model } from "mongoose";
import { VatDocI, VatE } from "../interface_vat/interface.vat";

const vatSchema = new Schema<VatDocI>(
  {
    percentage: Number,
    name: {
      enum: [VatE.LOCAL, VatE.ONLINE],
      required: true,
      type: String,
      unique:true
    },
  },
  { timestamps: true }
);

export const VAT = model<VatDocI>("VAT", vatSchema);
