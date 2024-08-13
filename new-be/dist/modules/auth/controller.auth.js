import { emailService } from '../notification';
import { refService } from '../referral';
import { tokenService } from '../token';
import { userService } from '../user';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import * as authService from './service.auth';
/* The `register` function is an asynchronous function that handles the registration of a user. It
takes in a request object (`req`) and a response object (`res`) as parameters. */
export const register = catchAsync(async (req, res) => {
    const user = await userService.registerUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    await refService.createReferral(user.id, req.body.refBy);
    res.status(httpStatus.CREATED).send({ user, tokens });
});
/* The `login` function is an asynchronous function that handles the login process. It takes in a
request object (`req`) and a response object (`res`) as parameters. */
export const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
});
/* The `logout` function is an asynchronous function that handles the logout process. It takes in a
request object (`req`) and a response object (`res`) as parameters. */
export const logout = catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});
/* The `refreshTokens` function is an asynchronous function that handles the refreshing of
authentication tokens. It takes in a request object (`req`) and a response object (`res`) as
parameters. */
export const refreshTokens = catchAsync(async (req, res) => {
    const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
    res.send(Object.assign({}, userWithTokens));
});
/* The `forgotPassword` function is an asynchronous function that handles the process of generating a
reset password token and sending a reset password email to the user. */
export const forgotPassword = catchAsync(async (req, res) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken, 'user');
    res.status(httpStatus.NO_CONTENT).send();
});
/* The `resetPassword` function is an asynchronous function that handles the process of resetting a
user's password. It takes in a request object (`req`) and a response object (`res`) as parameters. */
export const resetPassword = catchAsync(async (req, res) => {
    await authService.resetPassword(req.query['token'], req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
});
/* The `sendVerificationEmail` function is an asynchronous function that handles the process of sending
a verification email to a user. */
export const sendVerificationEmail = catchAsync(async (req, res) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.firstName);
    res.status(httpStatus.NO_CONTENT).send();
});
/* The `verifyEmail` function is an asynchronous function that handles the process of verifying a
user's email address. It takes in a request object (`req`) and a response object (`res`) as
parameters. */
export const verifyEmail = catchAsync(async (req, res) => {
    await authService.verifyEmail(req.query['token']);
    res.status(httpStatus.NO_CONTENT).send();
});
/* The `checkEmailExistence` function is an asynchronous function that checks if an email address
already exists in the system. It takes in a request object (`req`) and a response object (`res`) as
parameters. */
export const checkEmailExistence = catchAsync(async (req, res) => {
    const getEmailTruthy = await authService.checkIfEmailExist(req.body.email);
    res.status(httpStatus.OK).send(getEmailTruthy);
});
//# sourceMappingURL=controller.auth.js.map