import { ApiError } from '../../../errors';
import { userService } from '../../../user';
import { getUserById } from '../../../user/service.user';
import { decryptMe, encryptMe } from '../../../utils/encrypt';
import httpStatus from 'http-status';
import { CrudService } from '../../../genCrud';
import ROLES from '../models/model.roles';
export const createRoleService = async (req) => {
    const data = await CrudService.create({ exempt: '-_v', Model: ROLES }, Object.assign({}, req), { name: req.name.toLowerCase() });
    return data;
};
export const getRolesService = async (req) => {
    const data = await CrudService.getOne({ exempt: '-_v', Model: ROLES }, Object.assign({}, req), {});
    return data;
};
export const assignRolesService = async (req) => {
    const getRole = await CrudService.getOne({ exempt: '-_v', Model: ROLES }, { _id: req.role }, {});
    if (getRole && getRole.data && getRole.data) {
        const user = await userService.getUserByEmail(req.userEmail);
        if (!user)
            throw new Error('User not found');
        if (!getRole.data.name)
            throw new Error('Role not found');
        if (user) {
            const encryptedRoleName = encryptMe(getRole.data.name);
            user.role = encryptedRoleName;
            await user.save();
        }
    }
};
export const findUserRolesFromEncryptedRoleName = async (encryptedRoleName) => {
    const decryptedRoleName = decryptMe(encryptedRoleName);
    const role = await CrudService.getOne({ exempt: '-_v', Model: ROLES }, { name: decryptedRoleName }, {});
    return role;
};
export const checkStaffPermission = async (userId, permissions) => {
    const getUser = await getUserById(userId);
    if (!getUser)
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    const userRole = await findUserRolesFromEncryptedRoleName(getUser.role);
    if (!userRole || !(userRole === null || userRole === void 0 ? void 0 : userRole.data) || !(userRole === null || userRole === void 0 ? void 0 : userRole.data))
        throw new ApiError(httpStatus.NOT_FOUND, 'user role not found');
    const userPermissions = userRole.data.permissions;
    const hasPermission = permissions.every((permission) => userPermissions.includes(permission));
    return hasPermission;
};
//# sourceMappingURL=service.roles.js.map