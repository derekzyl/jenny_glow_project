import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
import { userController, userValidation } from '..';
import { allPermissions } from '../../setting/roles';
const userRoute = express.Router();
userRoute
    .route('/')
    .post(auth(allPermissions.User.Manage), validate(userValidation.createUser), userController.createUser)
    .get(auth(allPermissions.User.Get, allPermissions.User.Manage), validate(userValidation.getUsers), userController.getUsers);
userRoute
    .route('/:userId')
    .get(auth(), validate(userValidation.getUser), userController.getUser)
    .patch(auth(allPermissions.User.Manage), validate(userValidation.updateUser), userController.updateUser)
    .delete(auth(allPermissions.User.Manage), validate(userValidation.deleteUser), userController.deleteUser);
userRoute.post('/pin/change-password', auth(), validate(userValidation.changeUserPassword), userController.changeUserPassword);
userRoute.post('/pin/forgot-pin', auth(), validate(userValidation.forgotPin), userController.forgotPin);
userRoute.post('/pin/reset-pin', auth(), validate(userValidation.resetPin), userController.resetPin);
userRoute.post('/pin/create-pin', auth(), validate(userValidation.createPin), userController.createUserPin);
userRoute.post('/pin/update-pin', auth(), validate(userValidation.changePin), userController.changeUserPin);
userRoute.get('/pin/check-if-pin-exist', auth(), userController.checkIfUserHasPinCreated);
export default userRoute;
//# sourceMappingURL=user.route.v1.js.map