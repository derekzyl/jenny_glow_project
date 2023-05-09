import express, { Express } from "express";

import { errorCenter } from "./src/utilities/custom_error";
import roleRouter from "./src/api/admin/role/main_role/route.role";
import authRouter from "./src/api/auth/main_auth/route.auth";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", roleRouter);
app.use("/auth", authRouter);

// });
app.use(errorCenter);
export default app;
