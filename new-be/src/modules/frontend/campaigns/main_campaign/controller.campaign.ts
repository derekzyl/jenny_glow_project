import { Request, Response } from "express";
import { Types } from "mongoose";

import { ApiError } from "@modules/errors";
import { imageDeleteHandler } from "@modules/utils/file_handler/files_handler";
import httpStatus from "http-status";

import { catchAsync } from "@modules/utils";
import { CrudService } from "expressbolt";
import {
  CampaignBodyT,
  CampaignI,
  SliderBodyT,
  SliderI,
} from "../interface_campaigns/interface.campaign";
import { CAMPAIGN, SLIDER } from "./model.campaign";

export const createSlider =catchAsync (async (
  request: Request,
  response: Response,
  
) => {
  
    const body: SliderBodyT & { receiver: Types.ObjectId } = request.body;

    const gotten_body: SliderI = { ...body, createdBy: request.user.id };
    const crud_slider =await CrudService.create<SliderI>(
      {modelData:{ Model: SLIDER, select: [] },
      data:gotten_body,
      check:{}}
    );
  
  response.status(201).send(crud_slider)
});

export const getOneSlider =catchAsync (async (
  request: Request,
  response: Response,
  
) => {
  const crud_slider =await CrudService.getOne<SliderI>(
    {
      modelData: { Model: SLIDER, select: ["-__v", "-isActive"] },
    
    data: { _id: request.params["id"] },
    
    populate:{ path: "product", fields: ["-reviews"] }
}
  );
  response.send(crud_slider)
});

export const getManySlider = catchAsync(async (
  request: Request,
  response: Response,
  
) => {
  const crud_slider =await CrudService.getMany<SliderI>(
   { modelData:{ Model: SLIDER, select: ['-isActive'] },
   query: request.query,
  filter:  { is_active: true },
    populate:{}}
  );
  response.send(crud_slider)
});

export const updateSlider = catchAsync(async (
  request: Request,
  response: Response,
  
) => {
  const body = request.body;
  const crud_slider =await CrudService.update<SliderI>(
    {modelData:{ Model: SLIDER, select: ["-__v"] },
  data:  { ...body, updatedBy: request.user.id },
   filter: { _id: request.params["id"] }
    });
  response.send(crud_slider)
});
export const deleteSlider =catchAsync( async (
  request: Request,
  response: Response,
  
) => {
  const crud_slider =await CrudService.delete<SliderI>(
  {modelData:  { Model: SLIDER, select: ['-__v'] },
    data:{ _id: request.params["id"] }
    });
  response.send(crud_slider)
});

export const createCampaign = catchAsync(async (
  request: Request,
  response: Response,
  
) => {
  
    const body: CampaignBodyT = request.body;

    const gotten_body: CampaignI = { ...body, createdBy: request.user.id };
    const crud_campaign = CrudService.create<CampaignI>(
    {  modelData:{ Model: CAMPAIGN, select: [] },
      data:gotten_body,
      check:{}}
    );
  
  response.status(201).send(crud_campaign)
 
});

export const getOneCampaign = catchAsync(async (
  request: Request,
  response: Response,
  
) => {
  const crud_campaign =await CrudService.getOne<CampaignI>(
    {modelData:{ Model: CAMPAIGN, select: [] },
    data:{ campaign_name: request.params["id"] },
    populate:{}}
  );
  response.send(crud_campaign)
});

export const getManyCampaign =catchAsync( async (
  request: Request,
  response: Response,
  
) => {
  const crud_campaign =await CrudService.getMany<CampaignI>(
{  modelData:  { Model: CAMPAIGN, select: ['-isActive'] },
   query: request.query,
  filter:  { user: request.user.id },
 populate:   {}}
  );
  response.send(crud_campaign)
});

export const updateCampaign =catchAsync( async (
  request: Request,
  response: Response,
  
) => {
  const body = request.body;
  if (request.body.image) {
    const get_image_url = await CAMPAIGN.findById(request.params["id"]);
    if (!get_image_url) throw new ApiError(httpStatus.NOT_FOUND,"campaign banner not found");
    get_image_url.image ? imageDeleteHandler(get_image_url.image) : "";
  }
  const crud_campaign =await CrudService.update<CampaignI>(
{    modelData:{ Model: CAMPAIGN, select: [] },
    filter:{ campaign_name: request.params["id"] },
     data:{ ...body, updatedBy: request.user.id }}
  );
  response.send(crud_campaign)
});
export const deleteCampaign =catchAsync( async (
  request: Request,
  response: Response,
  
) => {

  const get_image_url = await CAMPAIGN.findById(request.params["id"]);
  if (!get_image_url) throw new ApiError(httpStatus.NOT_FOUND,"campaign banner not found");
  get_image_url.image ? imageDeleteHandler(get_image_url.image) : ""
  const crud_campaign =await CrudService.delete<CampaignI>(
   {modelData: { Model: CAMPAIGN, select: ['-__v'] },
   data: { _id: request.params["id"] }}
  );
  response.send(crud_campaign)
});
