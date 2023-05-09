import { Document, Types } from "mongoose";

interface locationI {
  longitude: string;
  latitude: string;
}

interface branchI extends Document {
  name: string;
  location: locationI;
  location_address: string;
  number_of_staff: number;
  created_at: Date;
  updated_at: Date;
}
