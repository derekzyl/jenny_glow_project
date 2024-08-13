// import { ApiError } from '../../errors';
// import httpStatus from 'http-status';
import STAFFS from './model.staff';
/**
 * The function `getAllStaffsUserId` retrieves all staffs and returns an array of their user IDs.
 * @returns The function `getAllStaffsUserId` returns an array of user IDs of all staff members.
 */
export const getAllStaffsUserId = async () => {
    const staffs = await STAFFS.find();
    if (!staffs)
        return; /* throw new ApiError(httpStatus.NOT_FOUND, 'staffs not found'); */
    return staffs.map((staff) => staff.userId);
};
//# sourceMappingURL=services.staff.js.map