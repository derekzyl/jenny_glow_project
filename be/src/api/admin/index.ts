import { Router } from "express";
import branchRouter from "./branch/main_branch/route.branch";
import roleRouter from "./role/main_role/route.role";
import staffRouter from "./staff/main_staff/route.staff";
import {
  categoryRouter,
  subCategoryRouter,
} from "./category/main_category/route.category";
import vatRouter from "./vat/main_vat/route.vat";

const adminRouter = Router();

adminRouter.use("/branch", branchRouter);
adminRouter.use("/role", roleRouter);
adminRouter.use("/staff", staffRouter);
adminRouter.use("/category", categoryRouter);
adminRouter.use("/sub-category", subCategoryRouter);
adminRouter.use("/vat", vatRouter);

export default adminRouter;
