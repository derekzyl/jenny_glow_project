import { CrudService } from '@modules/genCrud';
import Crud from '@modules/genCrud/crud.controller';
import responseMessage from '@modules/genCrud/responseMessage';
import { allPermissions } from '@modules/setting/roles';
import { catchAsync } from '@modules/utils';
import { PermissionType } from 'aws-sdk/clients/glue';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { IPermissionsDoc } from '../interfaces/interface.permissions';
import PERMISSIONS from '../models/models.permissions';
import { createOnePermissionService } from '../service.permissions';
import { assignRolesService, findUserRolesFromEncryptedRoleName } from '../services/service.roles';

export const getAllPermissionsController = async (req: Request, res: Response, next: NextFunction) => {
  const getAllPermissions = new Crud(req, res, next);
  await getAllPermissions.getMany({ exempt: '-_v', Model: PERMISSIONS }, req.query, {}, {});
};

export const getOnePermissionsController = async (req: Request, res: Response, next: NextFunction) => {
  const getOnePermission = new Crud(req, res, next);

  await getOnePermission.getOne({ exempt: '-_v', Model: PERMISSIONS }, req.body, {});
};

export const createPermissionsController = catchAsync(async (req: Request, res: Response) => {
  const createPermission = await createOnePermissionService(req.body);
  res.send(createPermission);
});

export const createManyPermissionsController = catchAsync(async (req: Request, res: Response) => {
  // logger.info(req.body);
  const createManyPermissions = await CrudService.createMany<PermissionType, IPermissionsDoc>(
    { exempt: '-_V', Model: PERMISSIONS },
    req.body,
    [{}]
  );
  res.send(createManyPermissions);
});

export const updatePermissionsController = async (req: Request, res: Response, next: NextFunction) => {
  const updatePermission = new Crud(req, res, next);

  await updatePermission.update<PermissionType, IPermissionsDoc>({ Model: PERMISSIONS, exempt: '-_v _id' }, req.body, {});
};
export const deletePermissionsController = async (req: Request, res: Response, next: NextFunction) => {
  const deletePermission = new Crud(req, res, next);

  await deletePermission.delete({ Model: PERMISSIONS, exempt: '-_v _id' }, req.body);
};

export const assignRoleController = catchAsync(async (req: Request, res: Response) => {
  const { email, roleId }: { email: string; roleId: Types.ObjectId } = req.body;
  await assignRolesService({ role: roleId, userEmail: email });
  res.status(httpStatus.NO_CONTENT).send();
});

export const getRolesFromUserRoleNameController = catchAsync(async (req: Request, res: Response) => {
  const role = req.body.role;
  const gottenRole = await findUserRolesFromEncryptedRoleName(role);
  return res.status(httpStatus.OK).send(gottenRole);
});


export const getAllPermissionsRaw = catchAsync(async (_req: Request, res: Response) => { 


    res.status(httpStatus.OK).send(responseMessage({message:"All permissions", data:allPermissions, success_status:true}));  
})