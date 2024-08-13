import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../errors/ApiError';
import { emailService } from '../notification';
import { sendNotification } from '../notification/service.notification';
import { tokenService } from '../token';
import catchAsync from '../utils/catchAsync';
import pick from '../utils/pick';
import * as userService from './service.user';
export const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    const token = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user.email, token, user.firstName);
    res.status(httpStatus.CREATED).send(user);
});
// admin access only
export const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['firstName', 'lastName', 'role', 'email']);
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await userService.queryUsers(filter, options);
    res.send(result);
});
// admin access only
export const getUser = catchAsync(async (req, res) => {
    if (typeof req.params['userId'] === 'string') {
        const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        res.send(user);
    }
});
export const updateUser = catchAsync(async (req, res) => {
    if (typeof req.params['userId'] === 'string') {
        const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']), req.body);
        res.send(user);
    }
});
export const deleteUser = catchAsync(async (req, res) => {
    if (typeof req.params['userId'] === 'string') {
        await userService.deleteUserById(new mongoose.Types.ObjectId(req.params['userId']));
        res.status(httpStatus.NO_CONTENT).send();
    }
});
export const changeUserPassword = catchAsync(async (req, res) => {
    const user = await userService.changeUserPasswordById(req.user.id, req.body);
    res.send(user);
});
export const createUserPin = catchAsync(async (req, res) => {
    const { user } = req;
    const { pin } = req.body;
    const response = await userService.createUserPin({ userId: user.id, pin });
    await sendNotification({
        body: `Your pin has been created successfully`,
        nType: 'both',
        title: 'Pin Created',
        type: 'Pin Created',
        userId: user.id,
    });
    res.status(httpStatus.CREATED).send(response);
});
export const changeUserPin = catchAsync(async (req, res) => {
    const { user } = req;
    const { pin, oldPin } = req.body;
    const response = await userService.changeUserPin({ userId: user.id, pin, oldPin });
    await sendNotification({
        body: `Your pin has been changed`,
        nType: 'both',
        title: 'Pin Changed',
        type: 'Pin Changed',
        userId: user.id,
    });
    res.status(httpStatus.OK).send(response);
});
export const deleteUserPin = catchAsync(async (req, res) => {
    await userService.deleteUserPinByUserId(req.user.id);
    res.status(httpStatus.NO_CONTENT).send();
});
export const forgotPin = catchAsync(async (req, res) => {
    const { user } = req;
    // const resetPinToken = tokenService.generateOtpToken();
    const resetPinToken = await tokenService.generateResetPinToken(user);
    // await emailService.sendResetPinEmail(user.email, resetPinToken, `${user.firstName} ${user.lastName}`);
    await sendNotification({
        body: `to reset your pin use the reset  \n  ${resetPinToken} `,
        title: 'Pin Reset',
        type: 'Pin Reset',
        nType: 'email',
        userId: user.id,
    });
    res.status(httpStatus.OK).send({ message: 'successfully sent you mail to change your pin' });
});
export const resetPin = catchAsync(async (req, res) => {
    const { pin } = req.body;
    const otpCode = req.query['token'] !== undefined ? req.query['token'].toString() : '';
    await userService.updateUserPinByUserId(req.user.id, { pin, otpCode });
    res.status(httpStatus.NO_CONTENT).send();
});
export const checkIfUserHasPinCreated = catchAsync(async (req, res) => {
    const { user } = req;
    const data = await userService.checkIfUserHasCreatedPin(user.id);
    res.status(httpStatus.OK).send({ status: data });
});
//# sourceMappingURL=controller.user.js.map