import { Router } from "express";

import { auth } from "@modules/auth";
import { allPermissions } from "@modules/setting/roles";

import { MULTER_UPLOAD, formFileHandler } from "@modules/utils/file_handler/middleware.file";
import { ProfileIndex } from "../index.profile";

const profileRouter = Router();

profileRouter
  .route('/')
  .post(
    auth(allPermissions.User.Manage, allPermissions.User.Create),
    MULTER_UPLOAD.fields([{ name: 'inventoryReceipt', maxCount: 1 }]),
    formFileHandler([{ name: 'inventoryReceipt' }]),
    ProfileIndex.create_profile
  )
  .get(
    auth(allPermissions.User.Manage, allPermissions.User.GetAll),
  
    ProfileIndex.get_all_profile
);
profileRouter.route("admin/:id").get(auth(allPermissions.User.Manage, allPermissions.User.Get), ProfileIndex.get_profile_by_id);
profileRouter.route("admin/:id").patch(auth(allPermissions.User.Manage, allPermissions.User.Update), ProfileIndex.update_profile_by_id);
profileRouter.route("admin/:id").delete(auth(allPermissions.User.Manage, allPermissions.User.Delete), ProfileIndex.delete_profile_by_id);

profileRouter
  .route("/user")
  .get(
    auth(),

    ProfileIndex.get_profile_by_user_id

  )
  .patch(
    auth(),
 MULTER_UPLOAD.fields([{ name: 'inventoryReceipt', maxCount: 1 }]),
    formFileHandler([{ name: 'inventoryReceipt' }]),
    ProfileIndex.update_profile_by_user_id
  )
  .delete(
    auth(),
   
    ProfileIndex.delete_profile_by_user_id
  );

export default profileRouter;
