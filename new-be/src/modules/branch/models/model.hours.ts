import { paginate } from "@modules/paginate";
import { easyCreated } from "@modules/utils/created";
import { model, Schema } from "mongoose";
import { WorkingHoursDocI, WorkingHoursModelI } from "../interface_branch/interface.branch";


const workingHoursSchema = new Schema<WorkingHoursDocI, WorkingHoursModelI>({
   ...easyCreated,
    day: { type: String, required: true, uppercase: true, trim: true, enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] },
    open: { type: String, required: true },
    close: { type: String, required: true },
    branch: { type: Schema.Types.ObjectId, ref: "BRANCH", required: true },
});
    
workingHoursSchema.plugin(paginate);
export const WORKING_HOURS = model("WORKING_HOURS", workingHoursSchema);


