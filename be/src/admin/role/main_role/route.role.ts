import { Router } from "express";
import { RoleIndex } from "../index.role";

const roleRouter = Router();
roleRouter.route("/").post(RoleIndex.createRole).get(RoleIndex.getAllRole);
roleRouter
  .route("/:id")
  .patch(RoleIndex.updateRole)
  .delete(RoleIndex.deleteRole);
export default roleRouter;
