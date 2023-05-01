import express, { Express } from "express";
import roleRouter from "./src/admin/role/main_role/route.role";
import { errorCenter } from "./src/utilities/custom_error";
import authRouter from "./src/auth/main_auth/route.auth";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", roleRouter);
app.use("/auth", authRouter);

// });
app.use(errorCenter);
export default app;
