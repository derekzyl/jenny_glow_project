import { Document, Model, Types } from "mongoose";

export interface ProfileI {
  userId: Types.ObjectId;

 image: string;
  gender: "male" | "female";
}

export interface ProfileDocI extends Document, ProfileI {}
export interface ProfileModelI extends Model<ProfileDocI> {
  checkDefaultProfile(): void;
}

export type ProfileBodyT = Omit<ProfileI, "user"> & {
  user_id: Types.ObjectId;
};
