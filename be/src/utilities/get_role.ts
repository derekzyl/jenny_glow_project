import { Types } from "mongoose";
import { ROLE } from "../api/admin/role/main_role/model.role";
import { responseMessage } from "./response_message";
import { HTTP_RESPONSE } from "./http_response";
import { APP_ERROR } from "./custom_error";

export const getRole = async (id: Types.ObjectId) => {
  try {
    const get_role = await ROLE.findById(id);
    if (get_role) return get_role;
    else {
      throw APP_ERROR(
        "the role came with some glitches",
        HTTP_RESPONSE.NOT_IMPLEMENTED
      );
    }
  } catch (error) {
    responseMessage({
      message: "error from getting role",
      data: error,
      success_status: false,
    });
  }
};
