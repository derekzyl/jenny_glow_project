/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { roleServices } from '../admin/Roles';
import { staffService } from '../admin/staff';
import { ApiError } from '../errors';
import { userService } from '../user';
import httpStatus from 'http-status';
import NOTIFICATIONS from './model.notification';
import { sendDefaultEmail } from './service.email';
/**
 * Send a NOTIFICATION
 * @param {string} title
 * @param {string} body
 * @returns {Promise<void>}
 */
export const createNotification = async (userId, title, body, type) => {
    const msg = {
        userId,
        title,
        body,
        viewed: false,
        type,
    };
    await NOTIFICATIONS.create(msg);
};
/**
 * Fetch user NOTIFICATIONSs
 * @param {string} userId
 * @returns {Promise<INotification>}
 */
export const queryNotifications = (userId) => NOTIFICATIONS.find({ userId });
export const viewNotification = async (id, userId) => {
    const viewed = await NOTIFICATIONS.findOneAndUpdate({ _id: id, userId }, { viewed: true });
    if (!viewed)
        throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    return viewed;
};
/**
 * The function `sendNotificationToStaffs` sends notifications to staff members based on specified
 * permissions and notification type.
 *
 * @param  The `sendNotificationToStaffs` function is designed to send notifications to staff members
 * based on certain criteria. Here's an explanation of the parameters: if you want to send to all staff add `ALL_STAFFS` in permission
 */
export const sendNotificationToStaffs = async ({ body, permissions, title, type, nType = 'both', }) => {
    try {
        const staffsId = await staffService.getAllStaffsUserId();
        if (staffsId && staffsId.length > 0 && staffsId !== null && staffsId !== undefined) {
            await Promise.all(staffsId.map(async (staffId) => {
                const hasPermission = await roleServices.checkStaffPermission(staffId, permissions);
                if (hasPermission) {
                    sendNotification({ body, nType, title, type, userId: staffId });
                    // Send notification to staff
                }
                if (permissions.includes('ALL_STAFFS'))
                    sendNotification({ body, nType, title, type, userId: staffId });
            }));
        }
    }
    catch (error) {
        // Handle the error here
    }
};
/**
 * The function `sendNotification` sends a notification to a user via email, notification, or both,
 * based on the specified parameters.
 *
 * @param  - `userId`: The ID of the user to whom the notification will be sent.
 */
export const sendNotification = async ({ body, nType, title, type, userId, }) => {
    const user = await userService.getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    }
    switch (nType) {
        case 'email':
            await sendDefaultEmail({ body, name: user.firstName, subject: title, to: user.email });
            break;
        case 'notification':
            await createNotification(userId, title, body, type);
            break;
        case 'both':
            await sendDefaultEmail({ body, name: user.firstName, subject: title, to: user.email });
            await createNotification(userId, title, body, type);
            break;
    }
};
export const sendNotificationViaEmail = async ({ body, nType, title, type, userEmail, }) => {
    const user = await userService.getUserByEmail(userEmail);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    }
    switch (nType) {
        case 'email':
            await sendDefaultEmail({ body, name: user.firstName, subject: title, to: user.email });
            break;
        case 'notification':
            await createNotification(user.id, title, body, type);
            break;
        case 'both':
            await sendDefaultEmail({ body, name: user.firstName, subject: title, to: user.email });
            await createNotification(user.id, title, body, type);
            break;
    }
};
//# sourceMappingURL=service.notification.js.map