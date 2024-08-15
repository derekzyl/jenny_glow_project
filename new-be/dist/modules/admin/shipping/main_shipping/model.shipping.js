import { easyCreated } from "../../../utils/created";
import { Schema, model } from "mongoose";
import { fetchCountres } from "./controller.shipping";
const shippingSchema = new Schema(Object.assign(Object.assign({ country: { type: String, required: true, uppercase: true } }, easyCreated), { countryShippingFee: {
        type: Number,
        required: true,
        uppercase: true,
        unique: true,
    }, useCountryShippingFeeAsDefault: {
        type: Boolean,
        required: true,
        default: false,
    }, states: [
        {
            name: { type: String, uppercase: true, unique: true },
            stateShippingFee: { type: Number },
        },
    ] }), { timestamps: true });
shippingSchema.pre("save", function () {
    var _a;
    if (this.useCountryShippingFeeAsDefault === true && !this.states) {
        const country = fetchCountres();
        const states = (_a = country.find((c) => c.name.toLowerCase() === this.country.toLowerCase())) === null || _a === void 0 ? void 0 : _a.states;
        if (states) {
            states.map((state) => {
                this.states.push({
                    name: state.name, stateShippingFee: this.countryShippingFee
                });
            });
        }
    }
});
export const SHIPPING = model("SHIPPING", shippingSchema);
//# sourceMappingURL=model.shipping.js.map