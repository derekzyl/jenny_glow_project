import { Document } from "mongoose";

export enum VatE {
  LOCAL = "LOCAL",
  ONLINE = "ONLINE",
}

export interface VatI {
  percentage: number;
  name: VatE;
  
}

export interface VatDocI extends VatI, Document {}
