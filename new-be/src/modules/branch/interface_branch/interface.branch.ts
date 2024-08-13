import { Document, Model, Types } from "mongoose";

interface locationI {
  longitude: string;
  latitude: string;
}



export enum BranchTypeE {
  ONLINE = "ONLINE",
  LOCAL = "LOCAL",
}

export interface BranchI {
  name: string;
  country: string;
  state: string;
  location: locationI;
  locationAddress: string;
  branchType: BranchTypeE;
  branchManager: Types.ObjectId;
  contactNumber: string;
  email: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  servicesOffered: string[];
  numberOfEmployees: number;
  establishedDate: Date;
  isActive: boolean;
  branchCode: string; // format country-state-branchType-branchNumber 
}

export interface BranchDocI extends BranchI, Document { }
export interface BranchModelI extends Model<BranchDocI> { }
export type branchBodyT = Omit<BranchI,|"updatedBy"|"branchCode"|"numberOfEmployees">& {
workingHours?: workingHoursI[]
}
export interface workingHoursI {
  day: string;
  open: string;
  close: string;
  branch: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}
export type newlyCreatedBranchT = Omit<BranchI, | "updatedBy" | "createdBy" | "isActive" | "establishedDate" | "branchCode" | "numberOfEmployees"> & {}
export interface WorkingHoursDocI extends workingHoursI, Document { }
export interface WorkingHoursModelI extends Model<WorkingHoursDocI> { }
