"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
class NodeMailer {
    async mailer(data) {
        try {
            // Generate test SMTP service account from ethereal.email
            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer_1.default.createTransport({
                host: "process.env.EMAIL_HOST",
                port: process.env.EMAIL_PORT,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER, // generated ethereal user
                    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
                },
            });
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: process.env.SENDER_MAIL, // sender address
                to: data.to, // list of receivers
                subject: data.subject, // Subject line
                text: data.text, // plain text body
                html: "<b>kindly follow the instructions to reset your password</b>", // html body
            });
            await transporter.sendMail(info);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = NodeMailer;
