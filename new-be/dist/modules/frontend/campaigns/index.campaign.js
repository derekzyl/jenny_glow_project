import { createCampaign, getOneCampaign, getManyCampaign, updateCampaign, deleteCampaign, createSlider, getOneSlider, getManySlider, updateSlider, deleteSlider, } from "./main_campaign/controller.campaign";
class Campaign {
    constructor() {
        this.create_campaign = createCampaign;
        this.get_one_campaign = getOneCampaign;
        this.get_all_campaign = getManyCampaign;
        this.update_campaign = updateCampaign;
        this.delete_campaign = deleteCampaign;
        this.create_slider = createSlider;
        this.get_one_slider = getOneSlider;
        this.get_all_slider = getManySlider;
        this.update_slider = updateSlider;
        this.delete_slider = deleteSlider;
    }
}
export const CampaignIndex = new Campaign();
//# sourceMappingURL=index.campaign.js.map