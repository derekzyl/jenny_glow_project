import { Schema, model } from "mongoose";
import { time_stamps } from "../../../general_factory/interface/general_factory";
import { BlogDocI } from "../interface_blog/interface.blog";

const blogSchema = new Schema<BlogDocI>(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    image: {
      type: String,
    },
    remarks: [
      {
        user: { type: Schema.Types.ObjectId, ref: "USERS" },
        upvote: { type: Boolean },
        downvote: { type: Boolean },
        comment: { type: String },
      },
    ],

    createdBy: { type: Schema.Types.ObjectId, ref: "USERS" },
  },

  { timestamps: time_stamps }
);

export const BLOG = model<BlogDocI>("BLOG", blogSchema);
