import { auth } from '../../../auth';
import { validate } from '../../../validate';
import express from 'express';
import { fxController, fxValidation } from '..';
import { allPermissions } from '../../../setting/roles';
const router = express.Router();
router
    .route('/')
    .get(auth(allPermissions.SuperAdmin), validate(fxValidation.getFxs), fxController.getManyFxsController)
    .post(auth(allPermissions.SuperAdmin), validate(fxValidation.createFx), fxController.createFxController);
router
    .route('/:id')
    .get(auth(allPermissions.SuperAdmin), validate(fxValidation.getFx), fxController.getOneFxByIdController)
    .patch(auth(allPermissions.SuperAdmin), validate(fxValidation.updateFxById), fxController.updateOneFxByIdController)
    .delete(auth(allPermissions.SuperAdmin), validate(fxValidation.deleteFx), fxController.deleteFxByIdController);
export default router;
//# sourceMappingURL=route.fx.v1.js.map