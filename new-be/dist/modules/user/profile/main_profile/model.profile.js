import { Schema, model } from "mongoose";
const profileSchema = new Schema({
    image: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    userId: { type: Schema.Types.ObjectId, required: true, unique: true, ref: "USER" },
}, { timestamps: true });
export const PROFILE = model("PROFILE", profileSchema);
//# sourceMappingURL=model.profile.js.map