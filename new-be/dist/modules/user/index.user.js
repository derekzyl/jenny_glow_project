import { Router } from "express";
import addressRouter from "./address/main_address/route.address";
import cartRouter from "./cart/main_cart/route.cart";
// import userDispatchRouter from "./general_user_api/routes.user.ts/dispatch.route.user";
import profileRouter from "./profile/main_profile/route.profile";
import userRoute from "./routes/user.route.v1";
import wishlistRouter from "./wishlist/main_wishlist/route.wishlist";
const userRouter = Router();
userRouter.use("/address", addressRouter);
userRouter.use("/profile", profileRouter);
userRouter.use("/wishlist", wishlistRouter);
// userRouter.use("/dispatch", userDispatchRouter);
userRouter.use("/cart", cartRouter);
userRouter.use("/", userRoute);
export default userRouter;
//# sourceMappingURL=index.user.js.map