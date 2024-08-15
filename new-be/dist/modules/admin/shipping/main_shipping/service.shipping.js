import { ADDRESS } from "../../../user/address/main_address/model.address";
import { SHIPPING } from "./model.shipping";
export async function getShippingFeeFromAddressId(addressId) {
    const address = await ADDRESS.findById(addressId);
    if (!address) {
        return 0;
    }
    const getShipping = await SHIPPING.findOne({ country: String(address.country).toUpperCase() });
    if (!getShipping)
        return 0;
    if (getShipping.useCountryShippingFeeAsDefault) {
        return getShipping.countryShippingFee;
    }
    const state = getShipping.states.find((s) => s.name === String(address.state).toUpperCase());
    if (!state)
        return 0;
    return state.stateShippingFee;
}
//# sourceMappingURL=service.shipping.js.map