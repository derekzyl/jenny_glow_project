import { Router } from "express";
import { RoleIndex } from "../index.role";

const roleRouter = Router();
roleRouter.route("/role/").post(RoleIndex.createRole).get(RoleIndex.getAllRole);
roleRouter
  .route("/create/:id")
  .patch(RoleIndex.updateRole)
  .delete(RoleIndex.deleteRole);
export default roleRouter;
