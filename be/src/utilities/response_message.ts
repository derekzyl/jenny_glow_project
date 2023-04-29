import * as dotenv from "dotenv";
dotenv.config();

export function responseMessage(
  message: string,
  success_status: boolean,
  data: any,
  stack?: any
) {
  switch (success_status) {
    case true:
      return {
        message,
        data,
        success_status,
      };

    case false:
      return {
        message,
        error: data,
        success_status,
        stack: process.env.NODE_ENV === "development" ? stack : {},
      };
    default:
      break;
  }
}
