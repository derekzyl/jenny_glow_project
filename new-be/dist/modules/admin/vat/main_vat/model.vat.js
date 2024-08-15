import { Schema, model } from "mongoose";
import { VatE } from "../interface_vat/interface.vat";
const vatSchema = new Schema({
    percentage: Number,
    name: {
        enum: [VatE.LOCAL, VatE.ONLINE],
        required: true,
        type: String,
        unique: true
    },
}, { timestamps: true });
export const VAT = model("VAT", vatSchema);
//# sourceMappingURL=model.vat.js.map