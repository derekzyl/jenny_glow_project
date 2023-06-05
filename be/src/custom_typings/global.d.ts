import { UserI } from "../api/auth/interface_auth/interface.auth";

export {};
declare global {
  namespace Express {
    export interface Request {
      user: UserI;
    }
  }
}
