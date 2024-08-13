import { ApiError } from '@modules/errors';
import Crud from '@modules/genCrud/crud.controller';
import CrudS from '@modules/genCrud/crud.service';
import { USERS } from '@modules/user';
import { IUserDoc } from '@modules/user/interfaces.user';
import { catchAsync } from '@modules/utils';
import { encryptMe } from '@modules/utils/encrypt';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { IRolesDoc, RoleTypes } from '../interfaces/interface.roles';
import ROLES from '../models/model.roles';
import { assignRolesService, findUserRolesFromEncryptedRoleName } from '../services/service.roles';

export const createRoleController = async (req: Request, res: Response, next: NextFunction) => {
  const rolesBody: RoleTypes = req.body;
  const createRole = new Crud(req, res, next);
  await createRole.create<RoleTypes, IRolesDoc>({ exempt: '-_v', Model: ROLES }, rolesBody, {
    name: rolesBody.name,
  });
};

export const getAllRolesController = async (req: Request, res: Response, next: NextFunction) => {
  const getAllRoles = new Crud(req, res, next);
  await getAllRoles.getMany<IRolesDoc>({ exempt: '-_v', Model: ROLES }, req.query, {}, {});
};

export const updateRoleController = async (req: Request, res: Response, next: NextFunction) => {
  const rolesBody: Partial<RoleTypes> = req.body;
  const id = new Types.ObjectId(req.params['roleId']);
  if (rolesBody.permissions) {
    const findRole = await ROLES.findById(id);
    if (!findRole) throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
    rolesBody.permissions = Array.from(new Set(rolesBody.permissions));
  }

  const updateRole = new Crud(req, res, next);
  await updateRole.update<RoleTypes, IRolesDoc>({ exempt: '-_v', Model: ROLES }, rolesBody, { _id: id });
};

export const deleteRoleController = async (req: Request, res: Response, next: NextFunction) => {
  const id = new Types.ObjectId(req.params['roleId']);
  // lets find if any user has this role assigned
  const getRole = await CrudS.getOne<IRolesDoc>({ exempt: '-_v', Model: ROLES }, { _id: id }, {});
  if (!getRole || getRole.success === false || (getRole.data && !getRole.data.name))
    throw new ApiError(httpStatus.BAD_REQUEST, 'role not found');
  const role = getRole.data?.name;
  const encryptRole = encryptMe(role);

  const findUserByRole = await CrudS.getOne<IUserDoc>({ exempt: '-_v', Model: USERS }, { role: encryptRole }, {});
  if (findUserByRole && findUserByRole.data)
    throw new ApiError(httpStatus.BAD_REQUEST, 'role is assigned to a user, cannot delete it');

  const deleteRole = new Crud(req, res, next);
  await deleteRole.delete<IRolesDoc>({ exempt: '-_v', Model: ROLES }, { _id: id });
};

export const getRoleControllerById = async (req: Request, res: Response, next: NextFunction) => {
  const id = new Types.ObjectId(req.params['roleId']);
  const getRole = new Crud(req, res, next);
  await getRole.getOne<IRolesDoc>({ exempt: '-_v', Model: ROLES }, { _id: id }, {});
};

export const getRoleControllerByName = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const getRole = new Crud(req, res, next);
  await getRole.getOne<IRolesDoc>({ exempt: '-_v', Model: ROLES }, { name }, {});
};

export const assignRoleController = catchAsync(async (req: Request, res: Response) => {
  const { staffEmail, roleId }: { staffEmail: string; roleId: Types.ObjectId } = req.body;
  await assignRolesService({ userEmail: staffEmail, role: roleId });
  res.status(httpStatus.OK).json({ message: 'Role assigned successfully' });
});

export const getRoleControllerForAuth = catchAsync(async (req: Request, res: Response) => {
  const { role }: { role: string } = req.body;
  const _role = await findUserRolesFromEncryptedRoleName(role);
  res.status(httpStatus.OK).send(_role);
});

interface IRoleX extends Pick<IRolesDoc, 'name' | 'details' | 'permissions' | 'id'> {
  userCount: number;
  createdAt: string;
}

export const getUserRolesCount = catchAsync(async (req: Request, res: Response) => {
  const roles = await CrudS.getMany<IRolesDoc>({ Model: ROLES, exempt: '-_v' }, {}, req.query, {});
  if (!roles || (roles && !roles.data)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no roles found');
  }
  const roleX: IRoleX[] = roles.data;
  const data = [];
  let obj = {};
  for (const role of roleX) {
    const roleName = encryptMe(role.name);
    const userRole = await USERS.countDocuments({ role: roleName });
    obj = {
      name: role.name,
      userCount: userRole,
      permissions: role.permissions,
      details: role.details,
      id: role.id,
      createdAt: role.createdAt,
    };
    data.push(obj);
  }
  res.status(httpStatus.OK).send(data);
});
