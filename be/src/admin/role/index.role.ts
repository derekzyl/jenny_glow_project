import {
  createRole,
  deleteOneRole,
  getAllRole,
  updateOneRole,
} from "./main_role/controller.role";

class RolIndex {
  public createRole = createRole;
  public getAllRole = getAllRole;
  public updateRole = updateOneRole;
  public deleteRole = deleteOneRole;
}
export const RoleIndex = new RolIndex();
