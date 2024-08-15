import { Router } from "express";
import {
  campaignRouter,
  sliderRouter,
} from "../frontend/campaigns/main_campaign/route.campaign";

import {
  categoryRouter,
  subCategoryRouter,
} from "./category/route.category";
// import dispatchRouter from "./dispatch/main_dispatch/route.dispatch";

import shippingRouter from "./shipping/main_shipping/route.role";

import branchRouter from "@modules/branch/main_branch/route.branch";
import rolesRouter from "./Roles/routes/roles.route.v1";
import staffRouter from "./staff/routes/route.staff.v1";
import vatRouter from "./vat/main_vat/route.vat";

const adminRouter = Router();

adminRouter.use("/branch", branchRouter);
adminRouter.use("/role", rolesRouter);
adminRouter.use("/staff", staffRouter);
adminRouter.use("/category", categoryRouter);
adminRouter.use("/sub-category", subCategoryRouter);
adminRouter.use("/vat", vatRouter);
adminRouter.use("/shipping", shippingRouter);
// adminRouter.use("/dispatch", dispatchRouter);
adminRouter.use("/campaign", campaignRouter);
adminRouter.use("/slider", sliderRouter);

export default adminRouter;
