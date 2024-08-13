import { auth } from '@modules/auth';
import { validate } from '@modules/validate';
import express, { Router } from 'express';
import { rolesController, rolesValidation } from '..';
import { allPermissions } from '../../../setting/roles';
import { assignRole } from '../validate/validation.roles';

const rolesRouter: Router = express.Router();
rolesRouter
  .route('/roles')
  .post(auth(allPermissions.Roles.Create), validate(rolesValidation.createRole), rolesController.createRoleController)
  .get(auth(allPermissions.Roles.GetAll), validate(rolesValidation.getRoles), rolesController.getAllRolesController);
rolesRouter
  .route('/roles/:roleId')
  .get(auth(allPermissions.Roles.Get), validate(rolesValidation.getRole), rolesController.getRoleControllerById)
  .patch(auth(allPermissions.Roles.Update), validate(rolesValidation.updateRole), rolesController.updateRoleController)
  .delete(auth(allPermissions.Roles.Delete), validate(rolesValidation.deleteRole), rolesController.deleteRoleController);
rolesRouter.route('/roles/role/name').post(validate(rolesValidation.getRoleByName), rolesController.getRoleControllerByName);
rolesRouter
  .route('/roles/role/auth')
  .post(auth(), validate(rolesValidation.getRoleFromUserRole), rolesController.getRoleControllerForAuth);
rolesRouter.post(
  './roles/user/assign',
  auth(allPermissions.Staffs.Update),
  validate(assignRole),
  rolesController.assignRoleController
);

rolesRouter.get('/get-user-roles-count', auth(allPermissions.Roles.GetAll), rolesController.getUserRolesCount);

export default rolesRouter;
