import ApiError from '@modules/errors/ApiError';
import { CrudService } from '@modules/genCrud';
import CrudS from '@modules/genCrud/crud.service';
import catchAsync from '@modules/utils/catchAsync';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { INotification, INotificationDoc } from './interfaces.notification';
import NOTIFICATIONS from './model.notification';
import * as notificationService from './service.notification';

/* The `getNotification` function is an asynchronous function that handles a request to retrieve
notifications for a specific user. Here's a breakdown of what it does: */
export const getNotification = catchAsync(async (req: Request, res: Response) => {
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
export const viewNotification = catchAsync(async (req: Request, res: Response) => {
  // const notification = await notificationService.viewNotification(req.params['notificationId'], req.user.id);

  const read = await CrudService.update<INotification, INotificationDoc>(
    { Model: NOTIFICATIONS, exempt: '-__v' },
    { viewed: true },
    { _id: req.params['notificationId'], userId: req.user.id }
  );
  res.status(httpStatus.OK).json(read);
});
/* The `sendNotifications` function is an asynchronous function that handles a request to send
notifications. Here's a breakdown of what it does: */
export const sendNotifications = catchAsync(async (req: Request, res: Response) => {
  const send = await notificationService.sendNotification(req.body);
  res.status(httpStatus.CREATED).json(send);
});
/* The `sendNotifications` function is an asynchronous function that handles a request to send
notifications. Here's a breakdown of what it does: */
export const sendNotificationsViaEmailAddress = catchAsync(async (req: Request, res: Response) => {
  const send = await notificationService.sendNotificationViaEmail(req.body);
  res.status(httpStatus.CREATED).json(send);
});

export const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const getMany = await CrudS.getMany<INotification>(
    { exempt: '-_V', Model: NOTIFICATIONS },
    req.query,
    { model: 'userId', fields: 'email firstName lastName' },
    {}
  );
  res.status(httpStatus.OK).json(getMany);
});

/* The `getAllUsersNotification` function is an asynchronous function that handles a request to
retrieve notifications for a specific user. Here's a breakdown of what it does: */
export const getAllUsersNotification = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const getMany = await CrudS.getMany<INotification>(
    { exempt: '-_V', Model: NOTIFICATIONS },
    req.query,
    {},
    { userId: user.id }
  );
  res.status(httpStatus.OK).json(getMany);
});

export const getANotificationById = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const getMany = await CrudS.getOne<INotificationDoc>(
      { exempt: '-_V', Model: NOTIFICATIONS },
      { _id: req.params['id'] },
      {}
    );
    res.status(httpStatus.OK).json(getMany);
  }
});
export const getUserNotificationById = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    const getMany = await CrudS.getOne<INotificationDoc>(
      { exempt: '-_V', Model: NOTIFICATIONS },
      { _id: req.params['id'], userId: req.user.id },
      {}
    );
    res.status(httpStatus.OK).json(getMany);
  }
});
