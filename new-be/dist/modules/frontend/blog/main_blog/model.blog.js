import { Schema, model } from "mongoose";
import { time_stamps } from "../../../general_factory/interface/general_factory";
const blogSchema = new Schema({
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
}, { timestamps: time_stamps });
export const BLOG = model("BLOG", blogSchema);
//# sourceMappingURL=model.blog.js.map