import { paginate } from "../../paginate";
import { easyCreated } from "../../utils/created";
import { model, Schema } from "mongoose";
const workingHoursSchema = new Schema(Object.assign(Object.assign({}, easyCreated), { day: { type: String, required: true, uppercase: true, trim: true, enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] }, open: { type: String, required: true }, close: { type: String, required: true }, branch: { type: Schema.Types.ObjectId, ref: "BRANCH", required: true } }));
workingHoursSchema.plugin(paginate);
export const WORKING_HOURS = model("WORKING_HOURS", workingHoursSchema);
//# sourceMappingURL=model.hours.js.map