import { catchAsync } from '@modules/utils';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { statServices } from '.';

export const getNotificationStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await statServices.getNotificationCount();
  res.status(httpStatus.OK).send(stats);
});
export const getStaffStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await statServices.getStaffCount();
  res.status(httpStatus.OK).send(stats);
});
export const getUserStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await statServices.getUserCount();
  res.status(httpStatus.OK).send(stats);
});
