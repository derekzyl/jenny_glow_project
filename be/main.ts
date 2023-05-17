import express, { Express } from "express";

import { errorCenter } from "./src/utilities/custom_error";

import authRouter from "./src/api/auth/main_auth/route.auth";
import adminRouter from "./src/api/admin";
import reviewRouter from "./src/api/review/main_review/route.review";
import productRouter from "./src/api/product/main_product/route.product";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/review", reviewRouter);
app.use("product", productRouter);

// });
app.use(errorCenter);
export default app;
