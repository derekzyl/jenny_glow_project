import mongoose from "mongoose";

enum RoleE {
  USER = "USER",
  MANAGER = "MANAGER",
  SUPER_ADMIN = "SUPER_ADMIN",
  DISPATCHER = "DISPATCHER",
  STAFF = "STAFF",
  STORE,
}

enum GenderE {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
interface UserI {
  email: string;
  username: string;
  password: string;
  role: RoleE;
}

interface UserProfileI {
  full_name: string;
  gender: GenderE;
  USER: mongoose.Types.ObjectId;
}
