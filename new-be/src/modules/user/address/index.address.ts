import {
  createAddress,
  deleteAddress,
  deleteAddressByUser,
  getAddressByUser,
  getAddressesByUser,
  getManyAddress,
  getOneAddress,
  setDefaultAddress,
  updateAddress
} from "./main_address/controller.address";

class Address {
  public createAddress = createAddress;
  public getAllAddress = getManyAddress;
  public updateAddress = updateAddress;
  public deleteAddress = deleteAddress;
  public getOneAddress = getOneAddress;
  public deleteAddressByUser = deleteAddressByUser;
  public getAddressByUser = getAddressByUser;
  public getAddressesByUser = getAddressesByUser;
  public setDefaultAddress = setDefaultAddress;
  
}
export const AddressIndex = new Address();
