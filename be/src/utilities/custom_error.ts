import { HTTP_RESPONSE } from "./http_response";

class AppError extends Error {
  statusCode!: number;

  constructor(message?: string, status?: number) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.stack = new Error().stack;

    if (message) {
      this.message = message;
    } else {
      this.message = "Something went wrong";
    }
    if (status) {
      this.statusCode = status;
    } else {
      this.statusCode = HTTP_RESPONSE.INTERNAL_SERVER_ERROR;
    }

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function APP_ERROR(message: string, status?: number) {
  const my_error = new AppError(message, status);
  return my_error;
}
