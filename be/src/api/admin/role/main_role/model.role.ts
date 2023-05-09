import mongoose from "mongoose";

import { RoleI } from "../interface_role/role";
import { PermissionsE } from "../../../general_factory/interface/general_factory";

const role_model = new mongoose.Schema<RoleI>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  permissions: [{ type: String, enum: PermissionsE }],
});

role_model.pre("save", function () {
  this.name = String(this.name).toLocaleUpperCase();
});

export const ROLE = mongoose.model("ROLE", role_model);
