import logger from '@modules/logger/logger';
import nodemailer from 'nodemailer';
import config from '../../config/config';
import { defaultEmailTemplate } from './emailTemplates/email.default';
import { emailVerificationTemplate } from './emailTemplates/email.verification';
import { Message } from './interfaces.email';

export const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise<void>}
 */
export const sendEmail = async (to: string, subject: string, text: string, html: string): Promise<void> => {
  logger.info(`'sendEmail', ${to}, ${subject}`);
  const msg: Message = {
    from: `PayPaddy 🪙💹 <${config.email.from}>`,
    to,
    subject,
    text,
    html,
  };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */ export const sendResetPasswordEmail = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Reset password';

  const text = `Hi,
  To reset your password, copy this token and insert in the token field ${token}
  If you did not request any password resets, then ignore this email.`;

  // const html = `
  // <div style="margin: 30px; padding: 30px; border: 1px solid #007BFF; border-radius: 20px; background-color: #f8f8f8;">
  //   <h4 style="color: #007BFF;"><strong>Dear user,</strong></h4>
  //   <p style="color: #555;">To reset your password, click on this link: <a href="${resetPasswordUrl}" style="color: #007BFF; text-decoration: none;">Reset Password</a></p>
  //   <p style="color: #555;">If you did not request any password resets, please ignore this email.</p>
  //   <p style="color: #555;">Thanks,</p>
  //   <p style="color: #007BFF;"><strong>Team</strong></p>
  // </div>`;
  const html = defaultEmailTemplate({
    body: `your reset password token  is ${token} \n kindly insert it in the token field as well as your new pin \n cheers!!! `,
    name,
    date: new Date().getUTCFullYear().toString(),
    subject: 'Reset password',
  });
  await sendEmail(to, subject, text, html);
};

/**
 * Send reset pin email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */ export const sendResetPinEmail = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Reset pin';
  const resetPinUrl = `${token}`;
  const text = `Hi,
  your reset pin  ${resetPinUrl}
  If you did not request any pin resets, then ignore this email.`;
  const html = defaultEmailTemplate({
    body: `your reset pin token is ${token} \n kindly insert it in the token field as well as your new pin \n cheers!!! `,
    name,
    date: new Date().getUTCFullYear().toString(),
    subject: 'Reset pin',
  });

  // const html = `
  // <div style="margin: 30px; padding: 30px; border: 1px solid #007BFF; border-radius: 20px; background-color: #f8f8f8;">
  //   <h4 style="color: #007BFF;"><strong>Dear ${name},</strong></h4>
  //   <p style="color:#ffffff>To reset your pin, use the token ${resetPinUrl}</p>
  //   <p style="color: #555;">If you did not request any pin resets, please ignore this email.</p>
  //   <p style="color: #555;">Thanks,</p>
  //   <p style="color: #007BFF;"><strong>Team</strong></p>
  // </div>`;

  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (to: string, token: string, name: string): Promise<void> => {
  logger.info(`Send verification email to ${to}`);
  const date = new Date().getUTCFullYear().toString();
  const subject = 'Email Verification';
  // const verificationEmailUrl = `http://${config.clientUrl}/verify-email?token=${token}`;
  const text = `Hi ${name},
  welcome to PayPaddy we are thrilled to have you here!!
 copy ${token} and paste it in the token field.
  If you did not create an account, then ignore this email.`;

  const html = emailVerificationTemplate({ date, name, token });

  await sendEmail(to, subject, text, html);
};

export const sendDefaultEmail = async ({
  name,
  subject,
  body,
  to,
}: {
  body: string;
  subject: string;
  name: string;
  to: string;
}) => {
  let bodyWithNewLines = body; // Default value is the original body text

  const date = new Date().getUTCFullYear().toString();
  if (body.length > 40) {
    // Insert a new line character (\n) for every 40 characters
    const regex = /.{1,40}/g;
    bodyWithNewLines = body.replace(regex, '$&\n');

    // Now, `bodyWithNewLines` contains the original text with new line characters
  }

  const text = `${subject}
hi, ${name}
,
We are always honored you are part of the winning team..
${bodyWithNewLines}`;

  const html = defaultEmailTemplate({ body, date, name, subject });

  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendSuccessfulRegistration = async (to: string, token: string, name: string): Promise<void> => {
  const subject = 'Email Verification';

  const text = `Hi ${name},
  Congratulations! Your account has been created.
  You are almost there. Complete the final step by verifying your email 
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;

  const html = `
  <div style="margin: 30px; padding: 30px; border: 1px solid #4CAF50; border-radius: 20px; background-color: #f8f8f8;">
    <h4 style="color: #4CAF50;"><strong>Hi ${name},</strong></h4>
    <p style="color: #555;">Congratulations! Your account has been created.</p>
    <p style="color: #555;">You are almost there. Complete the final step by verifying your email </p>
    <p style="color: #555;">Or copy ${token}</p>
    <p style="color: #555;">Don't hesitate to contact us if you face any problems</p>
    <p style="color: #555;">Regards,</p>
    <p style="color: #4CAF50;"><strong>Team</strong></p>
  </div>`;

  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendAccountCreated = async (to: string, name: string): Promise<void> => {
  const subject = 'Account Created Successfully';
  const loginUrl = `http://${config.clientUrl}/auth/login`;
  const text = `Hi ${name},
  Congratulations! Your account has been created successfully.
  You can now login at: ${loginUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;

  const html = `
  <div style="margin: 30px; padding: 30px; border: 1px solid #28a745; border-radius: 20px; background-color: #f8f8f8;">
    <h4 style="color: #28a745;"><strong>Hi ${name},</strong></h4>
    <p style="color: #555;">Congratulations! Your account has been created successfully.</p>
    <p style="color: #555;">You can now login at: <a href="${loginUrl}" style="color: #007BFF; text-decoration: none;">Login</a></p>
    <p style="color: #555;">Don't hesitate to contact us if you face any problems</p>
    <p style="color: #555;">Regards,</p>
    <p style="color: #28a745;"><strong>Team</strong></p>
  </div>`;

  await sendEmail(to, subject, text, html);
};
