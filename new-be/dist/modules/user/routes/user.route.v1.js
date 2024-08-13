import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
import { userController, userValidation } from '..';
import { allPermissions } from '../../setting/roles';
const router = express.Router();
router
    .route('/')
    .post(auth(allPermissions.Users.Manage), validate(userValidation.createUser), userController.createUser)
    .get(auth(allPermissions.Users.Get), validate(userValidation.getUsers), userController.getUsers);
router
    .route('/:userId')
    .get(auth(allPermissions.Users.UserOnly), validate(userValidation.getUser), userController.getUser)
    .patch(auth(allPermissions.Users.Manage), validate(userValidation.updateUser), userController.updateUser)
    .delete(auth(allPermissions.Users.Manage), validate(userValidation.deleteUser), userController.deleteUser);
router.post('/pin/change-password', auth(allPermissions.Users.UserOnly), validate(userValidation.changeUserPassword), userController.changeUserPassword);
router.post('/pin/forgot-pin', auth(allPermissions.Users.UserOnly), validate(userValidation.forgotPin), userController.forgotPin);
router.post('/pin/reset-pin', auth(allPermissions.Users.UserOnly), validate(userValidation.resetPin), userController.resetPin);
router.post('/pin/create-pin', auth(allPermissions.Users.UserOnly), validate(userValidation.createPin), userController.createUserPin);
router.post('/pin/update-pin', auth(allPermissions.Users.UserOnly), validate(userValidation.changePin), userController.changeUserPin);
router.get('/pin/check-if-pin-exist', auth(allPermissions.Users.UserOnly), userController.checkIfUserHasPinCreated);
export default router;
//# sourceMappingURL=user.route.v1.js.map