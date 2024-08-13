import { paginate } from "@modules/paginate";
import { easyCreated } from "@modules/utils/created";
import { Schema, model } from "mongoose";
import { BranchDocI, BranchModelI, BranchTypeE } from "../interface_branch/interface.branch";

const branchSchema = new Schema<BranchDocI, BranchModelI>(
  {
    ...easyCreated,
    name: { type: String, unique: true, required: true },
    location: { longitude: String, latitude: String },

    country: String,
    branchCode: { type: String, unique: true, required: true },
    locationAddress: { type: String, required: true },
    branchManager: { type: Schema.Types.ObjectId, ref: "USERS" },
    contactNumber: String,
    email: String,
    servicesOffered: [String],
    numberOfEmployees: Number,
    establishedDate: Date,
    isActive:{type: Boolean, default: true},

   
    branchType: {
      type: String,
      enum: BranchTypeE,
      default: BranchTypeE.LOCAL,
    },
    state: { type: String },
  },
  { timestamps: true }
);

branchSchema.pre("save",async  function () {
  if (this.branchType == BranchTypeE.ONLINE) {
    const findBranch = await BRANCH.findOne({ branchType: BranchTypeE.ONLINE });
    if(findBranch){
      throw new Error("Only one online branch is allowed");
    }
  }
  this.name = String(this.name).toLocaleUpperCase();

});
branchSchema.plugin(paginate);

export const BRANCH = model("BRANCH", branchSchema);
