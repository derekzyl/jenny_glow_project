import { NextFunction, Response, Request } from "express";
import { GeneralIndex } from "../../../general_factory/index.factory";
import { STAFF } from "./model.staff";
import { StaffBodyI } from "../interface_staff/staff";
import { USER } from "../../../auth/main_auth/model.auth";
import { APP_ERROR } from "../../../../utilities/custom_error";
import { HTTP_RESPONSE } from "../../../../utilities/http_response";
import { randomBytes, createHash } from "crypto";
import BCRYPT from "../../../../utilities/bcrypt";
import { dataI } from "../../../../utilities/interface_utilities/mail";
import NodeMailer from "../../../../utilities/mailer";
import { getRole } from "../../../../utilities/get_role";
import { responseMessage } from "../../../../utilities/response_message";
import { PermissionsE } from "../../../general_factory/interface/general_factory";

export const createStaff = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const staff_body: StaffBodyI = request.body;
  const email_regex = /^[a-zA-Z0-9_-]{3,}@[a-zA-Z]{3,}.[a-zA-Z]{2,}$/g;
  const password_regex = /^[a-zA-Z0-9!@#><,-_*&]{8,}$/g;
  const phone_regex = /^[+][0-9]{1,4}-[0-9]{5,11}$/g;

  try {
    const pRT = "email-" + randomBytes(20).toString("hex");

    const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000;
    const resetToken = createHash("sha256").update(pRT).digest("hex");

    const token_expires = new Date(resetTokenExpiry);

    if (!email_regex.test(staff_body.email))
      throw APP_ERROR(
        "the email is not a valid one",
        HTTP_RESPONSE.BAD_REQUEST
      );
    if (!password_regex.test(staff_body.password))
      throw APP_ERROR("password is not a valid one", HTTP_RESPONSE.BAD_REQUEST);
    if (!phone_regex.test(staff_body.phone))
      throw APP_ERROR("invalid phone number", HTTP_RESPONSE.BAD_REQUEST);
    const password = await BCRYPT.hash(staff_body.password);
    let check_if_user_exist = await USER.findOne({ email: staff_body.email });
    // if(check_if_email_exist){
    //     const check_user_role =
    //         await getRole(check_if_email_exist.role!)
    // }

    if (check_if_user_exist) {
      const check_user_role = await getRole(check_if_user_exist.role!);
      if (check_user_role && check_user_role.name !== "USER")
        throw APP_ERROR("user is already a staff kindly change the user role");
      check_if_user_exist = await USER.findByIdAndUpdate(
        check_if_user_exist.id,
        {
          permissions: staff_body.permissions,
          role: staff_body.role,
          phone: staff_body.phone ?? check_if_user_exist.phone,
        }
      );
    } else {
      const create_user = new USER({
        email: staff_body.email,
        password,
        token: resetToken,
        token_expires,
        role: staff_body.role,
        phone: staff_body.phone,
      });
      check_if_user_exist = await create_user.save();

      const url = `${request.protocol}://${request.get(
        "host"
      )}/api/v1/auth/verifyEmail/${pRT}`;
      const message = `You are receiving this email because you (or someone else) have requested the reset of a password. \n Please make a POST request to: ${url}`;

      const details: dataI = {
        to: `${staff_body.email}`,
        subject: "Password reset token is valid for 1 hour",
        text: message,
      };
      const nodeMailer = new NodeMailer();
      nodeMailer.mailer(details);
    }
    const create_staff = new STAFF({
      user: check_if_user_exist?.id,
      first_name: staff_body.first_name,
      last_name: staff_body.last_name,
      address: staff_body.address,
      branch: staff_body.branch,
      bank_details: staff_body.bank_details,
      username: staff_body.username,
    });
    const staff_created = await create_staff.save();
    response.status(HTTP_RESPONSE.CREATED).json(
      responseMessage({
        data: {
          full_name: {
            first_name: staff_created.first_name,
            last_name: staff_created.last_name,
          },
        },
        message: "staff created successfully",
        success_status: true,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;
    const update_body: Partial<StaffBodyI> = request.body;
    const { id } = request.params;
    const find_staff = await STAFF.findById(id);
    if (!find_staff)
      throw APP_ERROR("the staff does'nt exist in the data base ");
    const find_staff_user_model = await USER.findById(find_staff.user);
    if (find_staff_user_model && user.id === find_staff_user_model.id) {
      const update_user = await USER.findByIdAndUpdate(
        find_staff_user_model?.id,
        { phone: update_body.phone }
      );
      const update_staff_data = await STAFF.findByIdAndUpdate(id, {
        first_name: update_body.first_name,
        last_name: update_body.last_name,
        address: update_body.address,
        bank_details: {
          bank_name: update_body.bank_details.bank_name,
          account_name: update_body.bank_details.account_name,
          account_number: update_body.bank_details.account_number,
        },
        updated_at: Date.now(),
      });

      if (!update_staff_data || update_user)
        throw APP_ERROR("error updating staff", HTTP_RESPONSE.BAD_REQUEST);
    } else if (user?.permissions.includes(PermissionsE.EDIT_STAFF)) {
      const update_user = await USER.findByIdAndUpdate(
        find_staff_user_model?.id,
        {
          role: update_body.role ?? find_staff_user_model?.role,
          permissions:
            update_body.permissions ?? find_staff_user_model?.permissions,
          phone: update_body.phone ?? find_staff_user_model?.phone,
          updated_at: Date.now(),
        }
      );
      const update_staff_data = await STAFF.findByIdAndUpdate(id, {
        first_name: update_body.first_name ?? find_staff.first_name,
        last_name: update_body.last_name ?? find_staff.last_name,
        address: update_body.address ?? find_staff.address,
        branch: update_body.branch ?? find_staff.branch,
        bank_details: {
          bank_name:
            update_body.bank_details.bank_name ??
            find_staff.bank_details.bank_name,
          account_name:
            update_body.bank_details.account_name ??
            find_staff.bank_details.account_name,
          account_number:
            update_body.bank_details.account_number ??
            find_staff.bank_details.account_number,
        },
        updated_at: Date.now(),
      });
      if (!update_staff_data || !update_user)
        throw APP_ERROR("error updating staff", HTTP_RESPONSE.BAD_REQUEST);

      response.status(HTTP_RESPONSE.OK).json(
        responseMessage({
          message: "update successful",
          data: find_staff.first_name,
          success_status: true,
        })
      );
    }
  } catch (error) {
    next(error);
  }
};
export const getMyStaffProfile = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const findStaff = await STAFF.findOne(
    { user: request.user.id },
    "first_name, last_name, address, bank_details, username branch"
  ).populate("BRANCH");
  if (!findStaff)
    throw APP_ERROR(
      "staff does not exist in database",
      HTTP_RESPONSE.BAD_REQUEST
    );
  response.status(HTTP_RESPONSE.OK).json(
    responseMessage({
      message: "get staff profile successful",
      data: {},
      success_status: true,
    })
  );
};

export const getOneStaff = GeneralIndex.getOneFactory(STAFF);
export const getAllStaff = GeneralIndex.getAllFactory(STAFF);
export const deleteStaff = GeneralIndex.deleteOneFactory(STAFF);
