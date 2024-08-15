import { auth } from '../../../auth';
import { validate } from '../../../validate';
import express from 'express';
import { rolesController, rolesValidation } from '..';
import { allPermissions } from '../../../setting/roles';
import { assignRole } from '../validate/validation.roles';
const rolesRouter = express.Router();
rolesRouter
    .route('/roles')
    .post(auth(allPermissions.Role.Create), validate(rolesValidation.createRole), rolesController.createRoleController)
    .get(auth(allPermissions.Role.GetAll), validate(rolesValidation.getRoles), rolesController.getAllRolesController);
rolesRouter
    .route('/roles/:roleId')
    .get(auth(allPermissions.Role.Get), validate(rolesValidation.getRole), rolesController.getRoleControllerById)
    .patch(auth(allPermissions.Role.Update), validate(rolesValidation.updateRole), rolesController.updateRoleController)
    .delete(auth(allPermissions.Role.Delete), validate(rolesValidation.deleteRole), rolesController.deleteRoleController);
rolesRouter.route('/roles/role/name').post(validate(rolesValidation.getRoleByName), rolesController.getRoleControllerByName);
rolesRouter
    .route('/roles/role/auth')
    .post(auth(), validate(rolesValidation.getRoleFromUserRole), rolesController.getRoleControllerForAuth);
rolesRouter.post('./roles/user/assign', auth(allPermissions.Staff.Update), validate(assignRole), rolesController.assignRoleController);
rolesRouter.get('/get-user-roles-count', auth(allPermissions.Role.GetAll), rolesController.getUserRolesCount);
export default rolesRouter;
//# sourceMappingURL=roles.route.v1.js.map