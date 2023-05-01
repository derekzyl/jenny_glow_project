import { NextFunction, Request, Response, request } from "express";
import { APP_ERROR } from "../../utilities/custom_error";
import BCRYPT from "../../utilities/bcrypt";
import { USER } from "./model.auth";
import { createHash, randomBytes } from "crypto";
import { dataI } from "../../utilities/interface_utilities/mail";
import JWT from "../../utilities/jwt";

import NodeMailer from "../../utilities/mailer";
import { RequestBody } from "../interface_auth/auth";
import { ROLE } from "../../admin/role/main_role/model.role";
import { HTTP_RESPONSE } from "../../utilities/http_response";

export const signup = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, password, confirm_password } = request.body;

    const user_role = "";
    if (!email) {
      throw APP_ERROR("Email is required", HTTP_RESPONSE.BAD_REQUEST);
    }
    if (!email.includes("@", ".")) {
      throw APP_ERROR("Email is invalid", HTTP_RESPONSE.BAD_REQUEST);
    }
    const user = await USER.findOne({ email });

    if (user) {
      throw APP_ERROR("User already exists", HTTP_RESPONSE.BAD_REQUEST);
    }
    if (!password || !confirm_password) {
      throw APP_ERROR("Password is required", HTTP_RESPONSE.BAD_REQUEST);
    }
    if (password !== confirm_password) {
      throw APP_ERROR("Passwords do not match", HTTP_RESPONSE.BAD_REQUEST);
    }
    if (password.length < 8) {
      throw APP_ERROR(
        "Password must be at least 8 characters",
        HTTP_RESPONSE.BAD_REQUEST
      );
    }
    if (
      !password.match(/[a-z]/) ||
      !password.match(/[A-Z]/) ||
      !password.match(/[0-9]/) ||
      !password.match(/[!@#$%^&*]/)
    ) {
      throw APP_ERROR(
        "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
        HTTP_RESPONSE.BAD_REQUEST
      );
    }
    const encryptedPassword = await BCRYPT.hash(password);

    const pRT = "email-" + randomBytes(20).toString("hex");

    const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000;
    const resetToken = createHash("sha256").update(pRT).digest("hex");

    const TokenExpires = new Date(resetTokenExpiry);

    const url = `${request.protocol}://${request.get(
      "host"
    )}/api/v1/auth/verifyEmail/${pRT}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. \n Please make a POST request to: ${url}`;

    const details: dataI = {
      to: `${email}`,
      subject: "Password reset token is valid for 1 hour",
      text: message,
    };
    const nodeMailer = new NodeMailer();
    nodeMailer.mailer(details);

    const newUser = new USER({
      email,
      password: encryptedPassword,
      Token: resetToken,
      TokenExpires,
      role: "644da36acc996fe2be8239e9",
    });
    const newUSER = await newUser.save();
    const expire = process.env.JWT_EXPIRE || "1d";
    const token = JWT.generateToken({ id: newUSER._id }, { expiresIn: expire });

    response.status(HTTP_RESPONSE.CREATED).json({
      message:
        "User created successfully kindly check your inbox to verify your email",
      token,
    });
  } catch (error: any) {
    next(error);
  }
};

export const verifyEmail = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { tokenReset } = request.params;
    const checker = tokenReset.split("-")[0];
    if (!tokenReset) {
      throw APP_ERROR(
        "error verifying email please try again",
        HTTP_RESPONSE.BAD_REQUEST
      );
    }

    if (checker !== "email") {
      throw APP_ERROR("error please try again", HTTP_RESPONSE.BAD_REQUEST);
    }
    const resetPasswordToken: any = createHash("sha256")
      .update(tokenReset)
      .digest("hex");

    const user = await USER.findOne({
      Token: resetPasswordToken,
    });
    if (!user) {
      throw APP_ERROR("Invalid verification link", HTTP_RESPONSE.BAD_REQUEST);
    }
    const userX = user.TokenExpires;

    const d = new Date(userX);
    const da = d.getTime();
    if (da < Date.now()) {
      user.Token = undefined;
      user.TokenExpires = undefined;
      await user.save();
      throw APP_ERROR(" your link has expired", HTTP_RESPONSE.BAD_REQUEST);
    }
    user.isEmailVerified = true;
    user.save();

    const token = JWT.generateToken(
      { id: user.id },
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    response.status(200).json({
      status: "success",
      message: "email successfully verified",
      token,
    });
  } catch (err: any) {
    next(err);
  }
};
// export const checkIsEmailVerified = async (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) => {};

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email, password } = request.body;

  try {
    if (!email) {
      throw APP_ERROR("Email is required", HTTP_RESPONSE.BAD_REQUEST);
    }
    if (!email.includes("@")) {
      throw APP_ERROR("Email is invalid", HTTP_RESPONSE.BAD_REQUEST);
    }
    const user = await USER.findOne({ email });

    if (!user) {
      throw APP_ERROR("User does not exist", HTTP_RESPONSE.BAD_REQUEST);
    }
    const isPasswordMatch = await BCRYPT.compare(password, user.password);
    if (!isPasswordMatch) {
      throw APP_ERROR("Password is incorrect", HTTP_RESPONSE.BAD_REQUEST);
    }
    const expire = process.env.JWT_EXPIRE || "1d";
    const token = JWT.generateToken({ id: user._id }, { expiresIn: expire });

    response.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

export const protector = async (
  request: RequestBody,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = request.headers.authorization;
    if (!token) {
      throw APP_ERROR("Token is required", HTTP_RESPONSE.BAD_REQUEST);
    }
    const tokenData = token.split(" ")[1];
    const decoded = await JWT.verifyToken(tokenData);
    if (!decoded) {
      throw APP_ERROR("Token is invalid", HTTP_RESPONSE.BAD_REQUEST);
    }

    const user = await USER.findById(decoded.id);
    if (!user) {
      throw APP_ERROR("User does not exist", HTTP_RESPONSE.BAD_REQUEST);
    }
    if (user.isDeleted) {
      throw APP_ERROR(
        "User does not exist, please kindly register   ",
        HTTP_RESPONSE.BAD_REQUEST
      );
    }
    if (!user.isEmailVerified) {
      throw APP_ERROR("email not verified, kindly go to your mail to verify");
    }

    request.user = user;
    next();
  } catch (err: any) {
    next(err);
  }
};

export const logout = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = request.headers.authorization;
    if (!token) {
      throw APP_ERROR("Token is required", HTTP_RESPONSE.BAD_REQUEST);
    }
    const tokenData = token.split(" ")[1];
    const decoded = await JWT.verifyToken(tokenData);
    if (!decoded) {
      throw APP_ERROR("Token is invalid", HTTP_RESPONSE.BAD_REQUEST);
    }
    const user = await USER.findById(decoded.id);
    if (!user) {
      throw APP_ERROR("User does not exist", HTTP_RESPONSE.BAD_REQUEST);
    }
    response.status(200).json({
      message: "User logged out successfully",
    });
  } catch (err: any) {
    next(err);
  }
};

export const forgotPassword = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { email } = request.body;

  if (!email) {
    throw APP_ERROR(
      "Please provide all the required fields",
      HTTP_RESPONSE.BAD_REQUEST
    );
  }
  const user = await USER.findOne({
    email,
  });
  try {
    if (!user) {
      throw APP_ERROR("user or email dos not exist", 401);
    }
    const pRT = "password-" + randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000;
    const resetToken = createHash("sha256").update(pRT).digest("hex");

    user.Token = resetToken;
    user.TokenExpires = new Date(resetTokenExpiry);
    await user.save();

    const url = `${request.protocol}://${request.get(
      "host"
    )}/api/v1/auth/resetPassword/${pRT}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. \n Please make a POST request to: ${url}`;

    const details: dataI = {
      to: `${user.email}`,
      subject: "Password reset token is valid for 1 hour",
      text: message,
    };
    const nodeMailer = new NodeMailer();
    nodeMailer.mailer(details);

    response.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err: any) {
    // user?.resetPasswordToken = undefined;
    // user?.resetPasswordTokenExpires = undefined;
    // await USER.save();
    return next(err);
  }
};

export const resetPassword = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { tokenReset } = request.params;
    const { password, confirm_password } = request.body;

    if (!tokenReset || !password || !confirm_password) {
      throw APP_ERROR(
        "Please provide all the required fields",
        HTTP_RESPONSE.BAD_REQUEST
      );
    }
    if (password !== confirm_password) {
      throw APP_ERROR("Passwords do not match", HTTP_RESPONSE.BAD_REQUEST);
    }
    if (password.length < 6) {
      throw APP_ERROR(
        "Password must be at least 6 characters",
        HTTP_RESPONSE.BAD_REQUEST
      );
    }
    if (
      !password.match(/[a-z]/) ||
      !password.match(/[A-Z]/) ||
      !password.match(/[0-9]/) ||
      !password.match(/[!@#$%^&*]/)
    ) {
      throw APP_ERROR(
        "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
        HTTP_RESPONSE.BAD_REQUEST
      );
    }
    const resetPasswordToken: any = createHash("sha256")
      .update(tokenReset)
      .digest("hex");
    const user = await USER.findOne({
      Token: resetPasswordToken,
    });
    if (!user) {
      throw APP_ERROR("Invalid token", HTTP_RESPONSE.BAD_REQUEST);
    }
    const userX = user.TokenExpires;

    const d = new Date(userX);
    const da = d.getTime();
    if (da < Date.now()) {
      throw APP_ERROR(" your Token has expired", HTTP_RESPONSE.BAD_REQUEST);
    }
    user.password = await BCRYPT.hash(password);
    user.Token = undefined;
    user.TokenExpires = undefined;
    await user.save();

    const token = JWT.generateToken(
      { id: user.id },
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    response.status(200).json({
      status: "success",
      message: "password changed",
      token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updatePassword = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, password, confirm_password } = request.body;
    if (!password || !confirm_password) {
      throw APP_ERROR(
        "Please provide all the required fields",
        HTTP_RESPONSE.BAD_REQUEST
      );
    }
    if (password !== confirm_password) {
      throw APP_ERROR("Passwords do not match", HTTP_RESPONSE.BAD_REQUEST);
    }
    if (password.length < 6) {
      throw APP_ERROR(
        "Password must be at least 6 characters",
        HTTP_RESPONSE.BAD_REQUEST
      );
    }
    if (
      !password.match(/[a-z]/) ||
      !password.match(/[A-Z]/) ||
      !password.match(/[0-9]/) ||
      !password.match(/[!@#$%^&*]/)
    ) {
      throw APP_ERROR(
        "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
        HTTP_RESPONSE.BAD_REQUEST
      );
    }
    let token;
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith("Bearer")
    ) {
      token = request.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(APP_ERROR("You are not logged in", 401));
    }
    const decoded = JWT.verifyToken(token);
    const user = await USER.findById(decoded.id);
    if (user) {
      if (!BCRYPT.compare(currentPassword, user.password)) {
        throw APP_ERROR(
          "Current password is incorrect",
          HTTP_RESPONSE.BAD_REQUEST
        );
      }

      user.password = await BCRYPT.hash(password);
      user.passwordChangedAt = new Date();
      await user.save();
    }

    response.status(200).json({
      status: "success",
      message: "password changed",
      token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getRole = async (
  request: RequestBody,
  response: Response,
  next: NextFunction
) => {
  const user = request.user;
  try {
    if (!user) throw APP_ERROR("user not found", HTTP_RESPONSE.BAD_REQUEST);
    const get_role_name = await ROLE.findById(user.role);

    const gotten_role = get_role_name?.name;
    request.role = gotten_role;
    next();
  } catch (error) {
    next(error);
  }
};