import { auth } from "@modules/auth";
import { allPermissions } from "@modules/setting/roles";
import { formFileHandler, MULTER_UPLOAD } from "@modules/utils/file_handler/middleware.file";
import { Router } from "express";
import { PermissionsE } from "../../../general_factory/interface/general_factory";
import { getPermissions } from "../../../general_factory/permission_handler";
import { CampaignIndex } from "../index.campaign";

export const campaignRouter = Router();

export const sliderRouter = Router();




campaignRouter
  .route('/')
  .post(
    auth(allPermissions.Campaign.Create),
    MULTER_UPLOAD.fields([{ name: 'image', maxCount: 1 }]),
    formFileHandler([{ name: 'image' }]),
    getPermissions([PermissionsE.CREATE_CAMPAIGN, PermissionsE.SUPER_ADMIN]),
    CampaignIndex.create_campaign
  )
  .get(CampaignIndex.get_all_campaign);
campaignRouter
  .route("/:id")
  .get(CampaignIndex.get_one_campaign)
  .patch(
    auth(allPermissions.Campaign.Update),
    MULTER_UPLOAD.fields([{ name: 'image', maxCount: 1 }]),
    formFileHandler([{ name: 'image' }]),

    CampaignIndex.update_campaign
  )

  .delete(
    auth(allPermissions.Campaign.Delete),
    CampaignIndex.delete_campaign
  );

sliderRouter
  .route("/")
  .post(
    auth(allPermissions.Campaign.Create),
    MULTER_UPLOAD.fields([{ name: "image", maxCount: 1 }]),
    formFileHandler([{ name: "image" }]),
    CampaignIndex.create_slider
  )
  .get(CampaignIndex.get_all_slider);
sliderRouter
  .route("/:id")
  .get(CampaignIndex.get_one_slider)
  .patch(
    auth(allPermissions.Campaign.Update),
    MULTER_UPLOAD.fields([{ name: "image", maxCount: 1 }]),
    formFileHandler([{ name: "image" }]),
    CampaignIndex.update_slider
  )
  .delete(
    auth(allPermissions.Campaign.Delete),

    CampaignIndex.delete_slider
  );
