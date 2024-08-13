import { auth } from '@modules/auth';
import { allPermissions } from '@modules/setting/roles';
import { validate } from '@modules/validate';
import { Router } from 'express';
import { workingHoursController, workingHoursValidation } from '..';

const workingHoursRouter = Router();

workingHoursRouter
  .route('/')
  .post(auth(allPermissions.Branch.Create), validate(workingHoursValidation.createWorkingHours), workingHoursController.createWorkingHours)
  .get(auth(allPermissions.Branch.GetAll), validate(workingHoursValidation.getAllWorkingHours), workingHoursController.getAllWorkingHours);
workingHoursRouter
  .route('/:id')
  .get(auth(allPermissions.Branch.Get), validate(workingHoursValidation.getOneWorkingHours), workingHoursController.createWorkingHours)
    .patch(auth(allPermissions.Branch.Update), validate(workingHoursValidation.updateWorkingHours), workingHoursController.getAllWorkingHours)
    .delete(auth(allPermissions.Branch.Update), validate(workingHoursValidation.deleteWorkingHours), workingHoursController.getAllWorkingHours);


workingHoursRouter
    .route('/:id/branch-name')
    .get(auth(allPermissions.Branch.Get), validate(workingHoursValidation.getOneWorkingHours), workingHoursController.getWorkingHoursByBranch);



    export default workingHoursRouter;