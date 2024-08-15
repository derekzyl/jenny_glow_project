import { createAddress, deleteAddress, deleteAddressByUser, getAddressByUser, getAddressesByUser, getManyAddress, getOneAddress, setDefaultAddress, updateAddress } from "./main_address/controller.address";
class Address {
    constructor() {
        this.createAddress = createAddress;
        this.getAllAddress = getManyAddress;
        this.updateAddress = updateAddress;
        this.deleteAddress = deleteAddress;
        this.getOneAddress = getOneAddress;
        this.deleteAddressByUser = deleteAddressByUser;
        this.getAddressByUser = getAddressByUser;
        this.getAddressesByUser = getAddressesByUser;
        this.setDefaultAddress = setDefaultAddress;
    }
}
export const AddressIndex = new Address();
//# sourceMappingURL=index.address.js.map