import { Response, NextFunction, Request } from "express";
import { PermissionsE } from "./interface/general_factory";
import { APP_ERROR } from "../../utilities/custom_error";
import { HTTP_RESPONSE } from "../../utilities/http_response";

export const getPermissions =
  (role_name: PermissionsE) =>
  (request: Request, response: Response, next: NextFunction) => {
    const user = request.user;
    if (!user) throw APP_ERROR("oops the user does not exist");

    if (user.permissions && user.permissions.includes(role_name)) {
      next();
    } else {
      throw APP_ERROR(
        "you are not authenticated to access this data",
        HTTP_RESPONSE.UNAUTHORIZED
      );
    }
  };
