import { ApiError } from '@modules/errors';
import { CrudService } from '@modules/genCrud';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { IStaffDoc } from './interface.staff';
import STAFFS from './model.staff';

export const staffMiddleWare = () => async (req: Request, _response: Response, next: NextFunction) => {
  new Promise(async (resolve, reject) => {
    const findStaff = await CrudService.getOne<IStaffDoc>({ exempt: '-_v', Model: STAFFS }, { userId: req.user._id }, {});
    if (findStaff && findStaff!.data) {
      if (findStaff!.data!.isAuthenticated) {
        resolve(next());
        next();
      } else reject(new ApiError(httpStatus.UNAUTHORIZED, 'staff not authenticated'));
    } else reject(new ApiError(httpStatus.BAD_REQUEST, 'staff not found'));
  });
};
