import { ApiError } from '../../../errors';
import Crud from '../../../genCrud/crud.controller';
import CrudS from '../../../genCrud/crud.service';
import { USERS } from '../../../user';
import { catchAsync } from '../../../utils';
import { encryptMe } from '../../../utils/encrypt';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import ROLES from '../models/model.roles';
import { assignRolesService, findUserRolesFromEncryptedRoleName } from '../services/service.roles';
export const createRoleController = async (req, res, next) => {
    const rolesBody = req.body;
    const createRole = new Crud(req, res, next);
    await createRole.create({ exempt: '-_v', Model: ROLES }, rolesBody, {
        name: rolesBody.name,
    });
};
export const getAllRolesController = async (req, res, next) => {
    const getAllRoles = new Crud(req, res, next);
    await getAllRoles.getMany({ exempt: '-_v', Model: ROLES }, req.query, {}, {});
};
export const updateRoleController = async (req, res, next) => {
    const rolesBody = req.body;
    const id = new Types.ObjectId(req.params['roleId']);
    if (rolesBody.permissions) {
        const findRole = await ROLES.findById(id);
        if (!findRole)
            throw new ApiError(httpStatus.NOT_FOUND, 'role not found');
        rolesBody.permissions = Array.from(new Set(rolesBody.permissions));
    }
    const updateRole = new Crud(req, res, next);
    await updateRole.update({ exempt: '-_v', Model: ROLES }, rolesBody, { _id: id });
};
export const deleteRoleController = async (req, res, next) => {
    var _a;
    const id = new Types.ObjectId(req.params['roleId']);
    // lets find if any user has this role assigned
    const getRole = await CrudS.getOne({ exempt: '-_v', Model: ROLES }, { _id: id }, {});
    if (!getRole || getRole.success === false || (getRole.data && !getRole.data.name))
        throw new ApiError(httpStatus.BAD_REQUEST, 'role not found');
    const role = (_a = getRole.data) === null || _a === void 0 ? void 0 : _a.name;
    const encryptRole = encryptMe(role);
    const findUserByRole = await CrudS.getOne({ exempt: '-_v', Model: USERS }, { role: encryptRole }, {});
    if (findUserByRole && findUserByRole.data)
        throw new ApiError(httpStatus.BAD_REQUEST, 'role is assigned to a user, cannot delete it');
    const deleteRole = new Crud(req, res, next);
    await deleteRole.delete({ exempt: '-_v', Model: ROLES }, { _id: id });
};
export const getRoleControllerById = async (req, res, next) => {
    const id = new Types.ObjectId(req.params['roleId']);
    const getRole = new Crud(req, res, next);
    await getRole.getOne({ exempt: '-_v', Model: ROLES }, { _id: id }, {});
};
export const getRoleControllerByName = async (req, res, next) => {
    const { name } = req.body;
    const getRole = new Crud(req, res, next);
    await getRole.getOne({ exempt: '-_v', Model: ROLES }, { name }, {});
};
export const assignRoleController = catchAsync(async (req, res) => {
    const { staffEmail, roleId } = req.body;
    await assignRolesService({ userEmail: staffEmail, role: roleId });
    res.status(httpStatus.OK).json({ message: 'Role assigned successfully' });
});
export const getRoleControllerForAuth = catchAsync(async (req, res) => {
    const { role } = req.body;
    const _role = await findUserRolesFromEncryptedRoleName(role);
    res.status(httpStatus.OK).send(_role);
});
export const getUserRolesCount = catchAsync(async (req, res) => {
    const roles = await CrudS.getMany({ Model: ROLES, exempt: '-_v' }, {}, req.query, {});
    if (!roles || (roles && !roles.data)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'no roles found');
    }
    const roleX = roles.data;
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
//# sourceMappingURL=controller.roles.js.map