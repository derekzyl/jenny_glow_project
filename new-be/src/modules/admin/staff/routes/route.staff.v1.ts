import { auth, authValidation } from '@modules/auth';
import { validate } from '@modules/validate';
import { Router } from 'express';
import { staffController, staffValidation } from '..';
import { allPermissions } from '../../../setting/roles';

const staffRouter: Router =Router();

staffRouter
  .route('/')
  .get(auth(allPermissions.Staff.GetAll), validate(staffValidation.getStaffs), staffController.getManyStaffsController)
  .post(auth(allPermissions.Staff.Create), validate(staffValidation.createStaff), staffController.createStaffController);
staffRouter
  .route('/assign/user-as-staff')
  .post(auth(allPermissions.Staff.Create), validate(staffValidation.createStaff), staffController.makeExistingUserStaff);
staffRouter
  .route('/:id')
  .get(auth(allPermissions.Staff.Get), validate(staffValidation.getStaff), staffController.getOneStaffByIdController)
  .patch(
    auth(allPermissions.Staff.Update),
    validate(staffValidation.updateStaffById),
    staffController.updateOneStaffByIdController
  )

  .delete(
    auth(allPermissions.Staff.Delete),
    validate(staffValidation.deleteStaff),
    staffController.deleteStaffByIdController
  );

staffRouter
  .route('/user/data')
  .get(auth(), staffController.getOneStaffByUserId)
  .patch(auth(), validate(staffValidation.updateStaffByUser), staffController.updateOneStaffByUserIdController);

  staffRouter.route('/:id/branch').get(auth(), staffController.getStaffByBranchId);
staffRouter.route('/staff/login').post(validate(authValidation.login), staffController.staffLogin);

export default staffRouter;
