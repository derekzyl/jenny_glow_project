import ApiError from '../errors/ApiError';
import { CrudService } from '../genCrud';
import CrudS from '../genCrud/crud.service';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import NOTIFICATIONS from './model.notification';
import * as notificationService from './service.notification';
/* The `getNotification` function is an asynchronous function that handles a request to retrieve
notifications for a specific user. Here's a breakdown of what it does: */
export const getNotification = catchAsync(async (req, res) => {
    if (typeof req.params['userId'] === 'string') {
        const user = await notificationService.queryNotifications(req.params['userId']);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        res.send(user);
    }
});
/* The `viewNotification` function is an asynchronous function that handles a request to view a
specific notification based on the `notificationId` parameter in the request. Here's a breakdown of
what it does: */
export const viewNotification = catchAsync(async (req, res) => {
    // const notification = await notificationService.viewNotification(req.params['notificationId'], req.user.id);
    const read = await CrudService.update({ Model: NOTIFICATIONS, exempt: '-__v' }, { viewed: true }, { _id: req.params['notificationId'], userId: req.user.id });
    res.status(httpStatus.OK).json(read);
});
/* The `sendNotifications` function is an asynchronous function that handles a request to send
notifications. Here's a breakdown of what it does: */
export const sendNotifications = catchAsync(async (req, res) => {
    const send = await notificationService.sendNotification(req.body);
    res.status(httpStatus.CREATED).json(send);
});
/* The `sendNotifications` function is an asynchronous function that handles a request to send
notifications. Here's a breakdown of what it does: */
export const sendNotificationsViaEmailAddress = catchAsync(async (req, res) => {
    const send = await notificationService.sendNotificationViaEmail(req.body);
    res.status(httpStatus.CREATED).json(send);
});
export const getAllNotifications = catchAsync(async (req, res) => {
    const getMany = await CrudS.getMany({ exempt: '-_V', Model: NOTIFICATIONS }, req.query, { model: 'userId', fields: 'email firstName lastName' }, {});
    res.status(httpStatus.OK).json(getMany);
});
/* The `getAllUsersNotification` function is an asynchronous function that handles a request to
retrieve notifications for a specific user. Here's a breakdown of what it does: */
export const getAllUsersNotification = catchAsync(async (req, res) => {
    const { user } = req;
    const getMany = await CrudS.getMany({ exempt: '-_V', Model: NOTIFICATIONS }, req.query, {}, { userId: user.id });
    res.status(httpStatus.OK).json(getMany);
});
export const getANotificationById = catchAsync(async (req, res) => {
    if (typeof req.params['id'] === 'string') {
        const getMany = await CrudS.getOne({ exempt: '-_V', Model: NOTIFICATIONS }, { _id: req.params['id'] }, {});
        res.status(httpStatus.OK).json(getMany);
    }
});
export const getUserNotificationById = catchAsync(async (req, res) => {
    if (typeof req.params['id'] === 'string') {
        const getMany = await CrudS.getOne({ exempt: '-_V', Model: NOTIFICATIONS }, { _id: req.params['id'], userId: req.user.id }, {});
        res.status(httpStatus.OK).json(getMany);
    }
});
//# sourceMappingURL=controller.notification.js.map