import express, { Express } from "express";

import { errorCenter } from "./src/utilities/custom_error";

import authRouter from "./src/api/auth/main_auth/route.auth";
import adminRouter from "./src/api/admin";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", adminRouter);
app.use("/auth", authRouter);

// });
app.use(errorCenter);
export default app;
