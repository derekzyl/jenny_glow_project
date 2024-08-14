import { Schema, model } from "mongoose";
import {
  AddressDocI,
  AddressModelI,
} from "../interface_address/interface.address";

const addressSchema = new Schema<AddressDocI, AddressModelI>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "USERS" },
    address: { type: String, required: true },
    country: { type: String, required: true, uppercase: true },
    localGovernment: { type: String, required: true, uppercase: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true, uppercase: true },
    zipCode: { type: String, minlength: 5, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true}
);

addressSchema.pre("save", async function () {
  try {
    if (Boolean(this.isDefault) === true) {
      const getAddress = await ADDRESS.findOne({
        user: this.userId,
        isDefault: true,
      });
      if (getAddress) {
        getAddress.isDefault = false;
        getAddress.save();
      }
    }
  } catch (error: any) {
    throw new Error(error);
  }
});

// addressSchema.post("save", async function () {
//   try {
//   } catch (error: any) {
//     throw APP_ERROR(error);
//   }
// });

export const ADDRESS = model("ADDRESS", addressSchema);
