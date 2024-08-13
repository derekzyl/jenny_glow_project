import { ApiError } from '../../errors';
import { CrudService } from '../../genCrud';
import httpStatus from 'http-status';
import STAFFS from './model.staff';
export const staffMiddleWare = () => async (req, _response, next) => {
    new Promise(async (resolve, reject) => {
        const findStaff = await CrudService.getOne({ exempt: '-_v', Model: STAFFS }, { userId: req.user._id }, {});
        if (findStaff && findStaff.data) {
            if (findStaff.data.isAuthenticated) {
                resolve(next());
                next();
            }
            else
                reject(new ApiError(httpStatus.UNAUTHORIZED, 'staff not authenticated'));
        }
        else
            reject(new ApiError(httpStatus.BAD_REQUEST, 'staff not found'));
    });
};
//# sourceMappingURL=middleware.staff.js.map