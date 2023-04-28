export function responseMessage(
  message: string,
  success_status: boolean,
  data: any
) {
  switch (success_status) {
    case success_status === true:
      return {
        message,
        data,
        success_status,
      };

    case success_status === false:
      return {
        message,
        error: data,
        success_status,
      };
    default:
      break;
  }
}
