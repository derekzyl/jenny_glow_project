import { Document, Types } from "mongoose";

type CommentT = {
  user: Types.ObjectId;
  upvote: boolean;
  downvote: boolean;
  comment: string;
};

export interface BlogI {
  title: string;
  body: string;
  image: string;
  remarks?: [CommentT];
  createdBy: Types.ObjectId;

}

export interface BlogDocI extends BlogI, Document {}
export type BlogBodyI = Omit<BlogI,  "createdBy">;
