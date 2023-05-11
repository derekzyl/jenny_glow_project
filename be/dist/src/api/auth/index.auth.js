"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthIndex = void 0;
const controller_auth_1 = require("./main_auth/controller.auth");
class Auth {
    constructor() {
        this.signup = controller_auth_1.signup;
        this.verify_email = controller_auth_1.verifyEmail;
        this.login = controller_auth_1.login;
        this.protector = controller_auth_1.protector;
        this.logout = controller_auth_1.logout;
        this.forgot_password = controller_auth_1.forgotPassword;
        this.reset_password = controller_auth_1.resetPassword;
        this.update_password = controller_auth_1.updatePassword;
    }
}
exports.AuthIndex = new Auth();
