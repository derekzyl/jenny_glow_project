import { ApiError } from "../../../errors";
import { imageDeleteHandler } from "../../../utils/file_handler/files_handler";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils";
import { CrudService } from "expressbolt";
import { CAMPAIGN, SLIDER } from "./model.campaign";
export const createSlider = catchAsync(async (request, response) => {
    const body = request.body;
    const gotten_body = Object.assign(Object.assign({}, body), { createdBy: request.user.id });
    const crud_slider = await CrudService.create({ modelData: { Model: SLIDER, select: [] },
        data: gotten_body,
        check: {} });
    response.status(201).send(crud_slider);
});
export const getOneSlider = catchAsync(async (request, response) => {
    const crud_slider = await CrudService.getOne({
        modelData: { Model: SLIDER, select: ["-__v", "-isActive"] },
        data: { _id: request.params["id"] },
        populate: { path: "product", fields: ["-reviews"] }
    });
    response.send(crud_slider);
});
export const getManySlider = catchAsync(async (request, response) => {
    const crud_slider = await CrudService.getMany({ modelData: { Model: SLIDER, select: ['-isActive'] },
        query: request.query,
        filter: { is_active: true },
        populate: {} });
    response.send(crud_slider);
});
export const updateSlider = catchAsync(async (request, response) => {
    const body = request.body;
    const crud_slider = await CrudService.update({ modelData: { Model: SLIDER, select: ["-__v"] },
        data: Object.assign(Object.assign({}, body), { updatedBy: request.user.id }),
        filter: { _id: request.params["id"] } });
    response.send(crud_slider);
});
export const deleteSlider = catchAsync(async (request, response) => {
    const crud_slider = await CrudService.delete({ modelData: { Model: SLIDER, select: ['-__v'] },
        data: { _id: request.params["id"] }
    });
    response.send(crud_slider);
});
export const createCampaign = catchAsync(async (request, response) => {
    const body = request.body;
    const gotten_body = Object.assign(Object.assign({}, body), { createdBy: request.user.id });
    const crud_campaign = CrudService.create({ modelData: { Model: CAMPAIGN, select: [] },
        data: gotten_body,
        check: {} });
    response.status(201).send(crud_campaign);
});
export const getOneCampaign = catchAsync(async (request, response) => {
    const crud_campaign = await CrudService.getOne({ modelData: { Model: CAMPAIGN, select: [] },
        data: { campaign_name: request.params["id"] },
        populate: {} });
    response.send(crud_campaign);
});
export const getManyCampaign = catchAsync(async (request, response) => {
    const crud_campaign = await CrudService.getMany({ modelData: { Model: CAMPAIGN, select: ['-isActive'] },
        query: request.query,
        filter: { user: request.user.id },
        populate: {} });
    response.send(crud_campaign);
});
export const updateCampaign = catchAsync(async (request, response) => {
    const body = request.body;
    if (request.body.image) {
        const get_image_url = await CAMPAIGN.findById(request.params["id"]);
        if (!get_image_url)
            throw new ApiError(httpStatus.NOT_FOUND, "campaign banner not found");
        get_image_url.image ? imageDeleteHandler(get_image_url.image) : "";
    }
    const crud_campaign = await CrudService.update({ modelData: { Model: CAMPAIGN, select: [] },
        filter: { campaign_name: request.params["id"] },
        data: Object.assign(Object.assign({}, body), { updatedBy: request.user.id }) });
    response.send(crud_campaign);
});
export const deleteCampaign = catchAsync(async (request, response) => {
    const get_image_url = await CAMPAIGN.findById(request.params["id"]);
    if (!get_image_url)
        throw new ApiError(httpStatus.NOT_FOUND, "campaign banner not found");
    get_image_url.image ? imageDeleteHandler(get_image_url.image) : "";
    const crud_campaign = await CrudService.delete({ modelData: { Model: CAMPAIGN, select: ['-__v'] },
        data: { _id: request.params["id"] } });
    response.send(crud_campaign);
});
//# sourceMappingURL=controller.campaign.js.map