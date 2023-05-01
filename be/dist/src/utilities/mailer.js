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
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
class NodeMailer {
    mailer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Generate test SMTP service account from ethereal.email
                // create reusable transporter object using the default SMTP transport
                const transporter = nodemailer_1.default.createTransport({
                    host: "process.env.EMAIL_HOST",
                    port: process.env.EMAIL_PORT,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
                    },
                });
                // send mail with defined transport object
                const info = yield transporter.sendMail({
                    from: process.env.SENDER_MAIL,
                    to: data.to,
                    subject: data.subject,
                    text: data.text,
                    html: "<b>kindly follow the instructions to reset your password</b>", // html body
                });
                yield transporter.sendMail(info);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.default = NodeMailer;
