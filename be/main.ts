import express, { Express } from "express";
import roleRouter from "./src/admin/role/main_role/route.role";
import { errorCenter } from "./src/utilities/custom_error";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", roleRouter);

// });
app.use(errorCenter);
export default app;
