import { catchAsync } from '../../utils';
import httpStatus from 'http-status';
import { statServices } from '.';
export const getNotificationStats = catchAsync(async (_req, res) => {
    const stats = await statServices.getNotificationCount();
    res.status(httpStatus.OK).send(stats);
});
export const getStaffStats = catchAsync(async (_req, res) => {
    const stats = await statServices.getStaffCount();
    res.status(httpStatus.OK).send(stats);
});
export const getUserStats = catchAsync(async (_req, res) => {
    const stats = await statServices.getUserCount();
    res.status(httpStatus.OK).send(stats);
});
//# sourceMappingURL=controller.statistics.js.map