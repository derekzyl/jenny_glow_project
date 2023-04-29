import mongoose from "mongoose";

enum GenderE {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
interface UserI extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  role: mongoose.Types.ObjectId;
}
