"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.logout = exports.protector = exports.login = exports.verifyEmail = exports.signup = void 0;
const express_1 = require("express");
const custom_error_1 = require("../../utilities/custom_error");
const bcrypt_1 = __importDefault(require("../../utilities/bcrypt"));
const model_1 = require("../auth_main/model");
const crypto_1 = require("crypto");
const jwt_1 = __importDefault(require("../../utilities/jwt"));
const mailer_1 = __importDefault(require("../../utilities/mailer"));
const signup = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, confirmPassword } = request.body;
        if (!email) {
            throw (0, custom_error_1.APP_ERROR)("Email is required", 400);
        }
        if (!email.includes("@", ".")) {
            throw (0, custom_error_1.APP_ERROR)("Email is invalid", 400);
        }
        const user = yield model_1.USER.findOne({ email });
        if (user) {
            throw (0, custom_error_1.APP_ERROR)("User already exists", 400);
        }
        if (!password || !confirmPassword) {
            throw (0, custom_error_1.APP_ERROR)("Password is required", 400);
        }
        if (password !== confirmPassword) {
            throw (0, custom_error_1.APP_ERROR)("Passwords do not match", 400);
        }
        if (password.length < 8) {
            throw (0, custom_error_1.APP_ERROR)("Password must be at least 8 characters", 400);
        }
        if (!password.match(/[a-z]/) ||
            !password.match(/[A-Z]/) ||
            !password.match(/[0-9]/) ||
            !password.match(/[!@#$%^&*]/)) {
            throw (0, custom_error_1.APP_ERROR)("Password must contain at least one lowercase letter, one uppercase letter, one number and one special character", 400);
        }
        const encryptedPassword = yield bcrypt_1.default.hash(password);
        const pRT = "email-" + (0, crypto_1.randomBytes)(20).toString("hex");
        const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000;
        const resetToken = (0, crypto_1.createHash)("sha256").update(pRT).digest("hex");
        const TokenExpires = new Date(resetTokenExpiry);
        const url = `${request.protocol}://${request.get("host")}/api/v1/auth/verifyEmail/${pRT}`;
        const message = `You are receiving this email because you (or someone else) have requested the reset of a password. \n Please make a POST request to: ${url}`;
        const details = {
            to: `${email}`,
            subject: "Password reset token is valid for 1 hour",
            text: message,
        };
        const nodeMailer = new mailer_1.default();
        nodeMailer.mailer(details);
        const newUser = new model_1.USER({
            email,
            password: encryptedPassword,
            Token: resetToken,
            TokenExpires,
        });
        const newUSER = yield newUser.save();
        const expire = process.env.JWT_EXPIRE || "1d";
        const token = jwt_1.default.generateToken({ id: newUSER._id }, { expiresIn: expire });
        response.status(201).json({
            message: "User created successfully kindly check your inbox to verify your email",
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const verifyEmail = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenReset } = request.params;
        const checker = tokenReset.split("-")[0];
        if (!tokenReset) {
            throw (0, custom_error_1.APP_ERROR)("error verifying email please try again", 400);
        }
        if (checker !== "email") {
            throw (0, custom_error_1.APP_ERROR)("error please try again", 400);
        }
        const resetPasswordToken = (0, crypto_1.createHash)("sha256")
            .update(tokenReset)
            .digest("hex");
        const user = yield model_1.USER.findOne({
            Token: resetPasswordToken,
        });
        if (!user) {
            throw (0, custom_error_1.APP_ERROR)("Invalid verification link", 400);
        }
        const userX = user.TokenExpires;
        const d = new Date(userX);
        const da = d.getTime();
        if (da < Date.now()) {
            user.Token = undefined;
            user.TokenExpires = undefined;
            yield user.save();
            throw (0, custom_error_1.APP_ERROR)(" your link has expired", 400);
        }
        user.isEmailVerified = true;
        user.save();
        const token = jwt_1.default.generateToken({ id: user.id }, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        response.status(200).json({
            status: "success",
            message: "email successfully verified",
            token,
        });
    }
    catch (err) {
        response.status(500).json({ message: err.message });
    }
});
exports.verifyEmail = verifyEmail;
// export const checkIsEmailVerified = async (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) => {};
const login = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    try {
        if (!email) {
            throw (0, custom_error_1.APP_ERROR)("Email is required", 400);
        }
        if (!email.includes("@")) {
            throw (0, custom_error_1.APP_ERROR)("Email is invalid", 400);
        }
        const user = yield model_1.USER.findOne({ email });
        if (!user) {
            throw (0, custom_error_1.APP_ERROR)("User does not exist", 400);
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            throw (0, custom_error_1.APP_ERROR)("Password is incorrect", 400);
        }
        const expire = process.env.JWT_EXPIRE || "1d";
        const token = jwt_1.default.generateToken({ id: user._id }, { expiresIn: expire });
        response.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: token,
        });
    }
    catch (error) {
        response.status(400).json({
            success: false,
            message: "failed to sign up",
            data: error,
        });
    }
});
exports.login = login;
const protector = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = request.headers.authorization;
        if (!token) {
            throw (0, custom_error_1.APP_ERROR)("Token is required", 400);
        }
        const tokenData = token.split(" ")[1];
        const decoded = yield jwt_1.default.verifyToken(tokenData);
        if (!decoded) {
            throw (0, custom_error_1.APP_ERROR)("Token is invalid", 400);
        }
        const user = yield model_1.USER.findById(decoded.id);
        if (!user) {
            throw (0, custom_error_1.APP_ERROR)("User does not exist", 400);
        }
        if (user.isDeleted) {
            throw (0, custom_error_1.APP_ERROR)("User does not exist, please kindly register   ", 400);
        }
        if (!user.isEmailVerified) {
            throw (0, custom_error_1.APP_ERROR)("email not verified, kindly go to your mail to verify");
        }
        request.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.protector = protector;
const logout = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = request.headers.authorization;
        if (!token) {
            throw (0, custom_error_1.APP_ERROR)("Token is required", 400);
        }
        const tokenData = token.split(" ")[1];
        const decoded = yield jwt_1.default.verifyToken(tokenData);
        if (!decoded) {
            throw (0, custom_error_1.APP_ERROR)("Token is invalid", 400);
        }
        const user = yield model_1.USER.findById(decoded.id);
        if (!user) {
            throw (0, custom_error_1.APP_ERROR)("User does not exist", 400);
        }
        response.status(200).json({
            message: "User logged out successfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.logout = logout;
const forgotPassword = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = request.body;
    if (!email) {
        throw (0, custom_error_1.APP_ERROR)("Please provide all the required fields", 400);
    }
    const user = yield model_1.USER.findOne({
        email,
    });
    try {
        if (!user) {
            throw (0, custom_error_1.APP_ERROR)("user or email dos not exist", 401);
        }
        const pRT = "password-" + (0, crypto_1.randomBytes)(20).toString("hex");
        const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000;
        const resetToken = (0, crypto_1.createHash)("sha256").update(pRT).digest("hex");
        user.Token = resetToken;
        user.TokenExpires = new Date(resetTokenExpiry);
        yield user.save();
        const url = `${request.protocol}://${request.get("host")}/api/v1/auth/resetPassword/${pRT}`;
        const message = `You are receiving this email because you (or someone else) have requested the reset of a password. \n Please make a POST request to: ${url}`;
        const details = {
            to: `${user.email}`,
            subject: "Password reset token is valid for 1 hour",
            text: message,
        };
        const nodeMailer = new mailer_1.default();
        nodeMailer.mailer(details);
        response.status(200).json({
            status: "success",
            message: "token sent to email",
        });
    }
    catch (err) {
        // user?.resetPasswordToken = undefined;
        // user?.resetPasswordTokenExpires = undefined;
        // await USER.save();
        return next((0, custom_error_1.APP_ERROR)(err.message, 500));
        response.status(500).json({ message: err.message });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenReset } = express_1.request.params;
        const { password, confirmPassword } = express_1.request.body;
        if (!tokenReset || !password || !confirmPassword) {
            throw (0, custom_error_1.APP_ERROR)("Please provide all the required fields", 400);
        }
        if (password !== confirmPassword) {
            throw (0, custom_error_1.APP_ERROR)("Passwords do not match", 400);
        }
        if (password.length < 6) {
            throw (0, custom_error_1.APP_ERROR)("Password must be at least 6 characters", 400);
        }
        if (!password.match(/[a-z]/) ||
            !password.match(/[A-Z]/) ||
            !password.match(/[0-9]/) ||
            !password.match(/[!@#$%^&*]/)) {
            throw (0, custom_error_1.APP_ERROR)("Password must contain at least one lowercase letter, one uppercase letter, one number and one special character", 400);
        }
        const resetPasswordToken = (0, crypto_1.createHash)("sha256")
            .update(tokenReset)
            .digest("hex");
        const user = yield model_1.USER.findOne({
            Token: resetPasswordToken,
        });
        if (!user) {
            throw (0, custom_error_1.APP_ERROR)("Invalid token", 400);
        }
        const userX = user.TokenExpires;
        const d = new Date(userX);
        const da = d.getTime();
        if (da < Date.now()) {
            throw (0, custom_error_1.APP_ERROR)(" your Token has expired", 400);
        }
        user.password = yield bcrypt_1.default.hash(password);
        user.Token = undefined;
        user.TokenExpires = undefined;
        yield user.save();
        const token = jwt_1.default.generateToken({ id: user.id }, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        response.status(200).json({
            status: "success",
            message: "password changed",
            token,
        });
    }
    catch (err) {
        response.status(500).json({ message: err.message });
    }
});
exports.resetPassword = resetPassword;
const updatePassword = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, password, confirmPassword } = request.body;
        if (!password || !confirmPassword) {
            throw (0, custom_error_1.APP_ERROR)("Please provide all the required fields", 400);
        }
        if (password !== confirmPassword) {
            throw (0, custom_error_1.APP_ERROR)("Passwords do not match", 400);
        }
        if (password.length < 6) {
            throw (0, custom_error_1.APP_ERROR)("Password must be at least 6 characters", 400);
        }
        if (!password.match(/[a-z]/) ||
            !password.match(/[A-Z]/) ||
            !password.match(/[0-9]/) ||
            !password.match(/[!@#$%^&*]/)) {
            throw (0, custom_error_1.APP_ERROR)("Password must contain at least one lowercase letter, one uppercase letter, one number and one special character", 400);
        }
        let token;
        if (request.headers.authorization &&
            request.headers.authorization.startsWith("Bearer")) {
            token = request.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next((0, custom_error_1.APP_ERROR)("You are not logged in", 401));
        }
        const decoded = jwt_1.default.verifyToken(token);
        const user = yield model_1.USER.findById(decoded.id);
        if (user) {
            if (!bcrypt_1.default.compare(currentPassword, user.password)) {
                throw (0, custom_error_1.APP_ERROR)("Current password is incorrect", 400);
            }
            user.password = yield bcrypt_1.default.hash(password);
            user.passwordChangedAt = new Date();
            yield user.save();
        }
        response.status(200).json({
            status: "success",
            message: "password changed",
            token,
        });
    }
    catch (err) {
        response.status(500).json({ message: err.message });
    }
});
exports.updatePassword = updatePassword;
