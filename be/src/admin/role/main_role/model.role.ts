import mongoose from "mongoose";

import { RoleI } from "../interface_role/role";

const role_model = new mongoose.Schema<RoleI>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

role_model.pre("save", function () {
  this.name = String(this.name).toLocaleUpperCase();
});

export const ROLE = mongoose.model("ROLE", role_model);
