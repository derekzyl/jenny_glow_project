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
exports.deleteStaff = exports.getAllStaff = exports.getOneStaff = exports.updateStaff = exports.createStaff = void 0;
const index_factory_1 = require("../../../general_factory/index.factory");
const model_staff_1 = require("./model.staff");
const model_auth_1 = require("../../../auth/main_auth/model.auth");
const custom_error_1 = require("../../../../utilities/custom_error");
const http_response_1 = require("../../../../utilities/http_response");
const crypto_1 = require("crypto");
const bcrypt_1 = __importDefault(require("../../../../utilities/bcrypt"));
const mailer_1 = __importDefault(require("../../../../utilities/mailer"));
const get_role_1 = require("../../../../utilities/get_role");
const response_message_1 = require("../../../../utilities/response_message");
const general_factory_1 = require("../../../general_factory/interface/general_factory");
const createStaff = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const staff_body = request.body;
    const email_regex = /^[a-zA-Z0-9_-]{3,}@[a-zA-Z]{3,}.[a-zA-Z]{2,}$/g;
    const password_regex = /^[a-zA-Z0-9!@#><,-_*&]{8,}$/g;
    try {
        const pRT = "email-" + (0, crypto_1.randomBytes)(20).toString("hex");
        const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000;
        const resetToken = (0, crypto_1.createHash)("sha256").update(pRT).digest("hex");
        const token_expires = new Date(resetTokenExpiry);
        if (!email_regex.test(staff_body.email))
            throw (0, custom_error_1.APP_ERROR)("the email is not a valid one", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        if (!password_regex.test(staff_body.password))
            throw (0, custom_error_1.APP_ERROR)("password is not a valid one", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        const password = yield bcrypt_1.default.hash(staff_body.password);
        let check_if_user_exist = yield model_auth_1.USER.findOne({ email: staff_body.email });
        // if(check_if_email_exist){
        //     const check_user_role =
        //         await getRole(check_if_email_exist.role!)
        // }
        if (check_if_user_exist) {
            const check_user_role = yield (0, get_role_1.getRole)(check_if_user_exist.role);
            if (check_user_role && check_user_role.name !== "USER")
                throw (0, custom_error_1.APP_ERROR)("user is already a staff kindly change the user role");
            check_if_user_exist = yield model_auth_1.USER.findByIdAndUpdate(check_if_user_exist.id, {
                permissions: staff_body.permissions,
                role: staff_body.role,
            });
        }
        else {
            const create_user = new model_auth_1.USER({
                email: staff_body.email,
                password,
                token: resetToken,
                token_expires,
                role: staff_body.role,
            });
            check_if_user_exist = yield create_user.save();
            const url = `${request.protocol}://${request.get("host")}/api/v1/auth/verifyEmail/${pRT}`;
            const message = `You are receiving this email because you (or someone else) have requested the reset of a password. \n Please make a POST request to: ${url}`;
            const details = {
                to: `${staff_body.email}`,
                subject: "Password reset token is valid for 1 hour",
                text: message,
            };
            const nodeMailer = new mailer_1.default();
            nodeMailer.mailer(details);
        }
        const create_staff = new model_staff_1.STAFF({
            user: check_if_user_exist === null || check_if_user_exist === void 0 ? void 0 : check_if_user_exist.id,
            first_name: staff_body.first_name,
            last_name: staff_body.last_name,
            address: staff_body.address,
            branch: staff_body.branch,
            bank_details: staff_body.bank_details,
            username: staff_body.username,
        });
        const staff_created = yield create_staff.save();
        response.status(http_response_1.HTTP_RESPONSE.CREATED).json((0, response_message_1.responseMessage)({
            data: {
                full_name: {
                    first_name: staff_created.first_name,
                    last_name: staff_created.last_name,
                },
            },
            message: "staff created successfully",
            success_status: true,
        }));
    }
    catch (error) {
        response.status(http_response_1.HTTP_RESPONSE.BAD_REQUEST).json((0, response_message_1.responseMessage)({
            data: error,
            message: "error occurred while creating staff",
            success_status: false,
        }));
    }
});
exports.createStaff = createStaff;
const updateStaff = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const user = request.user;
        const update_body = request.body;
        const { id } = request.params;
        const find_staff = yield model_staff_1.STAFF.findById(id);
        if (!find_staff)
            throw (0, custom_error_1.APP_ERROR)("the staff does'nt exist in the data base ");
        const find_staff_user_model = yield model_auth_1.USER.findById(find_staff.user);
        if (find_staff_user_model && user.id === find_staff_user_model.id) {
            const update_staff_data = yield model_staff_1.STAFF.findByIdAndUpdate(id, {
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
            if (!update_staff_data)
                throw (0, custom_error_1.APP_ERROR)("error updating staff", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        }
        else if (user === null || user === void 0 ? void 0 : user.permissions.includes(general_factory_1.PermissionsE.EDIT_STAFF)) {
            const update_user = yield model_auth_1.USER.findByIdAndUpdate(find_staff_user_model === null || find_staff_user_model === void 0 ? void 0 : find_staff_user_model.id, {
                role: (_a = update_body.role) !== null && _a !== void 0 ? _a : find_staff_user_model === null || find_staff_user_model === void 0 ? void 0 : find_staff_user_model.role,
                permissions: (_b = update_body.permissions) !== null && _b !== void 0 ? _b : find_staff_user_model === null || find_staff_user_model === void 0 ? void 0 : find_staff_user_model.permissions,
                updated_at: Date.now(),
            });
            const update_staff_data = yield model_staff_1.STAFF.findByIdAndUpdate(id, {
                first_name: (_c = update_body.first_name) !== null && _c !== void 0 ? _c : find_staff.first_name,
                last_name: (_d = update_body.last_name) !== null && _d !== void 0 ? _d : find_staff.last_name,
                address: (_e = update_body.address) !== null && _e !== void 0 ? _e : find_staff.address,
                branch: (_f = update_body.branch) !== null && _f !== void 0 ? _f : find_staff.branch,
                bank_details: {
                    bank_name: (_g = update_body.bank_details.bank_name) !== null && _g !== void 0 ? _g : find_staff.bank_details.bank_name,
                    account_name: (_h = update_body.bank_details.account_name) !== null && _h !== void 0 ? _h : find_staff.bank_details.account_name,
                    account_number: (_j = update_body.bank_details.account_number) !== null && _j !== void 0 ? _j : find_staff.bank_details.account_number,
                },
                updated_at: Date.now(),
            });
            if (!update_staff_data || !update_user)
                throw (0, custom_error_1.APP_ERROR)("error updating staff", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
            response
                .status(http_response_1.HTTP_RESPONSE.OK)
                .json((0, response_message_1.responseMessage)({
                message: "update successful",
                data: find_staff.first_name,
                success_status: true,
            }));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateStaff = updateStaff;
exports.getOneStaff = index_factory_1.GeneralIndex.getOneFactory(model_staff_1.STAFF);
exports.getAllStaff = index_factory_1.GeneralIndex.getAllFactory(model_staff_1.STAFF);
exports.deleteStaff = index_factory_1.GeneralIndex.deleteOneFactory(model_staff_1.STAFF);
