import { Router } from "express";
import branchRouter from "./branch/main_branch/route.branch";
import roleRouter from "./role/main_role/route.role";

const adminRouter = Router();

adminRouter.use("/branch", branchRouter);
adminRouter.use("/role", roleRouter);
export default adminRouter;
