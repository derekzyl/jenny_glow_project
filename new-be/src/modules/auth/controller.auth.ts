import { emailService } from '@modules/notification';
import { refService } from '@modules/referral';
import { tokenService } from '@modules/token';
import { userService } from '@modules/user';
import catchAsync from '@modules/utils/catchAsync';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as authService from './service.auth';

/* The `register` function is an asynchronous function that handles the registration of a user. It
takes in a request object (`req`) and a response object (`res`) as parameters. */
export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);

  const tokens = await tokenService.generateAuthTokens(user);

  await refService.createReferral(user.id, req.body.refBy);

  res.status(httpStatus.CREATED).send({ user, tokens });
});

/* The `login` function is an asynchronous function that handles the login process. It takes in a
request object (`req`) and a response object (`res`) as parameters. */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  res.send({ user, tokens });
});

/* The `logout` function is an asynchronous function that handles the logout process. It takes in a
request object (`req`) and a response object (`res`) as parameters. */
export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/* The `refreshTokens` function is an asynchronous function that handles the refreshing of
authentication tokens. It takes in a request object (`req`) and a response object (`res`) as
parameters. */
export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...userWithTokens });
});

/* The `forgotPassword` function is an asynchronous function that handles the process of generating a
reset password token and sending a reset password email to the user. */
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken, 'user');
  res.status(httpStatus.NO_CONTENT).send();
});

/* The `resetPassword` function is an asynchronous function that handles the process of resetting a
user's password. It takes in a request object (`req`) and a response object (`res`) as parameters. */
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'], req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

/* The `sendVerificationEmail` function is an asynchronous function that handles the process of sending
a verification email to a user. */
export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.firstName);
  res.status(httpStatus.NO_CONTENT).send();
});

/* The `verifyEmail` function is an asynchronous function that handles the process of verifying a
user's email address. It takes in a request object (`req`) and a response object (`res`) as
parameters. */
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query['token']);

  res.status(httpStatus.NO_CONTENT).send();
});

/* The `checkEmailExistence` function is an asynchronous function that checks if an email address
already exists in the system. It takes in a request object (`req`) and a response object (`res`) as
parameters. */
export const checkEmailExistence = catchAsync(async (req: Request, res: Response) => {
  const getEmailTruthy = await authService.checkIfEmailExist(req.body.email);
  res.status(httpStatus.OK).send(getEmailTruthy);
});
