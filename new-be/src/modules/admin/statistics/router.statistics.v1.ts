import { auth } from '@modules/auth';
import { Router } from 'express';
import { statController } from '.';

const statsRouter = Router();

statsRouter.get('/user', auth(), statController.getUserStats);
statsRouter.get('/staff', auth(), statController.getStaffStats);
statsRouter.get('/notification', auth(), statController.getNotificationStats);
export default statsRouter;
