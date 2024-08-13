import { Router } from "express";
import blogRouter from "./blog/main_blog/route.blog";
import {
  campaignRouter,
  sliderRouter,
} from "./campaigns/main_campaign/route.campaign";

const frontRouter = Router();

frontRouter.use("/campaign", campaignRouter);
frontRouter.use("/slides", sliderRouter);
frontRouter.use("/blogs", blogRouter);
export default frontRouter;
