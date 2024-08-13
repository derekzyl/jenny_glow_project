import { auth, authValidation } from '../../../auth';
import { validate } from '../../../validate';
import express from 'express';
import { staffController, staffValidation } from '..';
import { allPermissions } from '../../../setting/roles';
const router = express.Router();
router
    .route('/')
    .get(auth(allPermissions.Staffs.GetAll), validate(staffValidation.getStaffs), staffController.getManyStaffsController)
    .post(auth(allPermissions.Staffs.Create), validate(staffValidation.createStaff), staffController.createStaffController);
router
    .route('/assign/user-as-staff')
    .post(auth(allPermissions.Staffs.Create), validate(staffValidation.createStaff), staffController.makeExistingUserStaff);
router
    .route('/:id')
    .get(auth(allPermissions.Staffs.Get), validate(staffValidation.getStaff), staffController.getOneStaffByIdController)
    .patch(auth(allPermissions.Staffs.Update), validate(staffValidation.updateStaffById), staffController.updateOneStaffByIdController)
    .delete(auth(allPermissions.Staffs.Delete), validate(staffValidation.deleteStaff), staffController.deleteStaffByIdController);
router
    .route('/user/data')
    .get(auth(), staffController.getOneStaffByUserId)
    .patch(auth(), validate(staffValidation.updateStaffByUser), staffController.updateOneStaffByUserIdController);
router.route('/staff/login').post(validate(authValidation.login), staffController.staffLogin);
export default router;
//# sourceMappingURL=route.staff.v1.js.map