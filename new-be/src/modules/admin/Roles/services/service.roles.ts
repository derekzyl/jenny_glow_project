import { ApiError } from '@modules/errors';
import { userService } from '@modules/user';
import { getUserById } from '@modules/user/service.user';
import { decryptMe, encryptMe } from '@modules/utils/encrypt';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { CrudService } from '../../../genCrud';
import { IRolesDoc, RoleTypes } from '../interfaces/interface.roles';
import ROLES from '../models/model.roles';

export const createRoleService = async (req: RoleTypes) => {
  const data = await CrudService.create<RoleTypes, IRolesDoc>(
    { exempt: '-_v', Model: ROLES },
    { ...req },
    { name: req.name.toLowerCase() }
  );
  return data;
};

export const getRolesService = async (req: Partial<RoleTypes & { _id: Types.ObjectId }>) => {
  const data = await CrudService.getOne<IRolesDoc>({ exempt: '-_v', Model: ROLES }, { ...req }, {});
  return data;
};

export const assignRolesService = async (req: { userEmail: string; role: Types.ObjectId }) => {
  const getRole = await CrudService.getOne<IRolesDoc>({ exempt: '-_v', Model: ROLES }, { _id: req.role }, {});
  if (getRole && getRole.data && getRole.data) {
    const user = await userService.getUserByEmail(req.userEmail);
    if (!user) throw new Error('User not found');
    if (!getRole.data.name) throw new Error('Role not found');

    if (user) {
      const encryptedRoleName = encryptMe(getRole.data.name);
      user.role = encryptedRoleName;

      await user.save();
    }
  }
};

export const findUserRolesFromEncryptedRoleName = async (encryptedRoleName: string) => {
  const decryptedRoleName = decryptMe(encryptedRoleName);

  const role = await CrudService.getOne<IRolesDoc>({ exempt: '-_v', Model: ROLES }, { name: decryptedRoleName }, {});
  return role;
};

export const checkStaffPermission = async (userId: Types.ObjectId, permissions: Array<string>) => {
  const getUser = await getUserById(userId);
  if (!getUser) throw new ApiError(httpStatus.NOT_FOUND, 'user not found');

  const userRole = await findUserRolesFromEncryptedRoleName(getUser.role);
  if (!userRole || !userRole?.data || !userRole?.data) throw new ApiError(httpStatus.NOT_FOUND, 'user role not found');

  const userPermissions = userRole.data.permissions;
  const hasPermission = permissions.every((permission) => userPermissions.includes(permission));
  return hasPermission;
};
