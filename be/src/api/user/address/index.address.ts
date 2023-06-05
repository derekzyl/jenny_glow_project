import {
  createAddress,
  deleteAddress,
  getManyAddress,
  updateAddress,
} from "./main_address/controller.address";

class Address {
  public createAddress = createAddress;
  public getAllAddress = getManyAddress;
  public updateAddress = updateAddress;
  public deleteAddress = deleteAddress;
}
export const AddressIndex = new Address();
