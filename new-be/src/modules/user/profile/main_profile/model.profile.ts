import { Schema, model } from "mongoose";
import {
  ProfileDocI,
  ProfileModelI,
} from "../interface_profile/interface.profile";

const profileSchema = new Schema<ProfileDocI, ProfileModelI>(
  {

image: { type: String},
    gender: { type: String, enum: ["male", "female"] },
    userId: { type: Schema.Types.ObjectId, required: true, unique:true, ref: "USER" },
  },
  { timestamps: true }
);

export const PROFILE = model("PROFILE", profileSchema);
