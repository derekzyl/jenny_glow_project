import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
import { systemValidation } from '.';
import { allPermissions } from '../../setting/roles';
import { createSystemController, deleteSystemController, getSystemController, getSystemsController, updateSystemController, } from './controller.system';
const router = express.Router();
router
    .route('/')
    .post(auth(allPermissions.System.Create), validate(systemValidation.createSystem), createSystemController)
    .get(getSystemsController);
router
    .route('/:id')
    .get(validate(systemValidation.getSystem), getSystemController)
    .patch(auth(allPermissions.System.Update), validate(systemValidation.updateSystem), updateSystemController)
    .delete(auth(allPermissions.System.Delete), validate(systemValidation.deleteSystem), deleteSystemController);
export default router;
//# sourceMappingURL=route.system.v1.js.map