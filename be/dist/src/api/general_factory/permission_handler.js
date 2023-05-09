"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissions = void 0;
const custom_error_1 = require("../../utilities/custom_error");
const http_response_1 = require("../../utilities/http_response");
const getPermissions = (role_name) => (request, response, next) => {
    const user = request.user;
    if (!user)
        throw (0, custom_error_1.APP_ERROR)("oops the user does not exist");
    if (user.permissions && user.permissions.includes(role_name)) {
        next();
    }
    else {
        throw (0, custom_error_1.APP_ERROR)("you are not authenticated to access this data", http_response_1.HTTP_RESPONSE.UNAUTHORIZED);
    }
};
exports.getPermissions = getPermissions;
