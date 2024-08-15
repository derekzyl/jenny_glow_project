/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { roleServices } from '@modules/admin/Roles';
import { staffService } from '@modules/admin/staff';
import { branchService } from '@modules/branch';
import { ApiError } from '@modules/errors';
import { userService } from '@modules/user';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { INotification } from './interfaces.notification';
import NOTIFICATIONS from './model.notification';
import { sendDefaultEmail } from './service.email';

/**
 * Send a NOTIFICATION
 * @param {string} title
 * @param {string} body
 * @returns {Promise<void>}
 */
export const createNotification = async (
  userId: Types.ObjectId,
  title: string,
  body: string,
  type: string
): Promise<void> => {
  const msg: INotification = {
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
export const queryNotifications = (userId: string): Promise<INotification[]> => NOTIFICATIONS.find({ userId });

export const viewNotification = async (id: Types.ObjectId, userId: Types.ObjectId) => {
  const viewed = await NOTIFICATIONS.findOneAndUpdate({ _id: id, userId }, { viewed: true });
  if (!viewed) throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  return viewed;
};


export const sendNotificationToManager = async ({
  body,
  title,
  type,
  nType = 'both',
  branchId
}: {
  title: string;
  body: string;
  type: string;

    nType?: 'email' | 'notification' | 'both';
  branchId?: Types.ObjectId|null;
}) => {
  try {
    // we check if the branchId is provided
    if (branchId) {
      // we get the branch manager
      const branch = await branchService.getBranchById(branchId);
      if (branch['data'] && branch['data'].branchManager) {
        // we send the notification to the branch manager
        sendNotification({ body, nType, title, type, userId: branch['data'].branchManager });

      }
    }
    else {
      const managers = await branchService.getBranchManagerUserId();
      if (managers && managers["data"]) {
        await Promise.all(
          managers["data"].map(async (managerId) => {
            sendNotification({ body, nType, title, type, userId: managerId.branchManager });
        
          }))
      }
    }
    
  } catch (error) {
    // Handle the error here
  }
};





/**
 * The function `sendNotificationToStaffs` sends notifications to staff members based on specified
 * permissions and notification type.
 *
 * @param  The `sendNotificationToStaffs` function is designed to send notifications to staff members
 * based on certain criteria. Here's an explanation of the parameters: if you want to send to all staff add `ALL_STAFFS` in permission
 */
export const sendNotificationToStaffs = async({
  body,
  permissions,
  title,
  type,
  nType = 'both',
  branchId
}: {
  title: string;
  body: string;
  type: string;
  permissions: string[];
  nType?: 'email' | 'notification' | 'both';
  branchId?: Types.ObjectId|null;
}) => {
  try {
    const staffsId = await staffService.getAllStaffsUserId();
    if (staffsId && staffsId.length > 0 && staffsId !== null && staffsId !== undefined) {
      await Promise.all(
        staffsId.map(async (staffId) => {
          const hasPermission = await roleServices.checkStaffPermission(staffId, permissions);
          if (hasPermission) {
            if (branchId) {
              const staff = await staffService.getStaffByUserId(staffId);
              if (staff && staff.branchId && staff.branchId.equals(branchId)) {
                sendNotification({ body, nType, title, type, userId: staffId });
              }
              

             }
            else{
            sendNotification({ body, nType, title, type, userId: staffId });}
            // Send notification to staff
          }
          if (permissions.includes('ALL_STAFFS')) sendNotification({ body, nType, title, type, userId: staffId });
        })
      );
    }
  } catch (error) {
    // Handle the error here
  }
};



/**
 * The function `sendNotification` sends a notification to a user via email, notification, or both,
 * based on the specified parameters.
 *
 * @param  - `userId`: The ID of the user to whom the notification will be sent.
 */
export const sendNotification = async ({
  body,
  nType,
  title,
  type,
  userId,
}: {
  userId: Types.ObjectId;
  nType: 'email' | 'notification' | 'both';
  body: string;
  title: string;
  type: string;
}) => {
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
export const sendNotificationViaEmail = async ({
  body,
  nType,
  title,
  type,
  userEmail,
}: {
  userEmail: string;
  nType: 'email' | 'notification' | 'both';
  body: string;
  title: string;
  type: string;
}) => {
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
