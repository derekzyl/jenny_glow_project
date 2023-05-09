import { Document } from "mongoose";
import { PermissionsE } from "../../../general_factory/interface/general_factory";

interface RoleI extends Document {
  name: string;
  permissions: PermissionsE[];
}
