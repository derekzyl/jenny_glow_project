import { CrudService } from '../../../genCrud';
import Crud from '../../../genCrud/crud.controller';
import responseMessage from '../../../genCrud/responseMessage';
import { allPermissions } from '../../../setting/roles';
import { catchAsync } from '../../../utils';
import httpStatus from 'http-status';
import PERMISSIONS from '../models/models.permissions';
import { createOnePermissionService } from '../service.permissions';
import { assignRolesService, findUserRolesFromEncryptedRoleName } from '../services/service.roles';
export const getAllPermissionsController = async (req, res, next) => {
    const getAllPermissions = new Crud(req, res, next);
    await getAllPermissions.getMany({ exempt: '-_v', Model: PERMISSIONS }, req.query, {}, {});
};
export const getOnePermissionsController = async (req, res, next) => {
    const getOnePermission = new Crud(req, res, next);
    await getOnePermission.getOne({ exempt: '-_v', Model: PERMISSIONS }, req.body, {});
};
export const createPermissionsController = catchAsync(async (req, res) => {
    const createPermission = await createOnePermissionService(req.body);
    res.send(createPermission);
});
export const createManyPermissionsController = catchAsync(async (req, res) => {
    // logger.info(req.body);
    const createManyPermissions = await CrudService.createMany({ exempt: '-_V', Model: PERMISSIONS }, req.body, [{}]);
    res.send(createManyPermissions);
});
export const updatePermissionsController = async (req, res, next) => {
    const updatePermission = new Crud(req, res, next);
    await updatePermission.update({ Model: PERMISSIONS, exempt: '-_v _id' }, req.body, {});
};
export const deletePermissionsController = async (req, res, next) => {
    const deletePermission = new Crud(req, res, next);
    await deletePermission.delete({ Model: PERMISSIONS, exempt: '-_v _id' }, req.body);
};
export const assignRoleController = catchAsync(async (req, res) => {
    const { email, roleId } = req.body;
    await assignRolesService({ role: roleId, userEmail: email });
    res.status(httpStatus.NO_CONTENT).send();
});
export const getRolesFromUserRoleNameController = catchAsync(async (req, res) => {
    const role = req.body.role;
    const gottenRole = await findUserRolesFromEncryptedRoleName(role);
    return res.status(httpStatus.OK).send(gottenRole);
});
export const getAllPermissionsRaw = catchAsync(async (_req, res) => {
    res.status(httpStatus.OK).send(responseMessage({ message: "All permissions", data: allPermissions, success_status: true }));
});
//# sourceMappingURL=controller.permissions.js.map