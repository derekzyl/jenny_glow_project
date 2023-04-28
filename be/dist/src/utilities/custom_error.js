"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_ERROR = void 0;
const http_response_1 = require("./http_response");
class AppError extends Error {
    constructor(message, status) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.stack = new Error().stack;
        if (message) {
            this.message = message;
        }
        else {
            this.message = "Something went wrong";
        }
        if (status) {
            this.statusCode = status;
        }
        else {
            this.statusCode = http_response_1.HTTP_RESPONSE.INTERNAL_SERVER_ERROR;
        }
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
function APP_ERROR(message, status) {
    const my_error = new AppError(message, status);
    return my_error;
}
exports.APP_ERROR = APP_ERROR;
