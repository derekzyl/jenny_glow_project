import { ADDRESS } from "./model.address";
import { ApiError } from "../../../errors";
import { phoneRegex } from "../../../utils/utils";
import httpStatus from "http-status";
export async function createAddress(body, userId) {
    const regex_check = phoneRegex(body.phone);
    if (!regex_check) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid phone number");
    }
    // find the  user address length
    const get_addresses = await ADDRESS.find({ user: userId });
    if (!get_addresses || get_addresses.length < 1) {
        body.isDefault = true;
    }
    const create_address = await ADDRESS.create(Object.assign(Object.assign({}, body), { user: userId }));
    return create_address;
}
export async function getUserDefaultAddress(userId) {
    const getOne = await ADDRESS.findOne({ user: userId, isDefault: true });
    return getOne;
}
export async function getOneAddressById(id) {
    const getOne = await ADDRESS.findById(id);
    return getOne;
}
//# sourceMappingURL=service.address.js.map