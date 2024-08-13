import { auth } from '@modules/auth';
import { validate } from '@modules/validate';
import express, { Router } from 'express';
import { notificationController, notificationValidation } from '..';

const router: Router = express.Router();

router.post('/', auth(), validate(notificationValidation.sendNotification), notificationController.sendNotifications);
router.post(
  '/',
  auth(),
  validate(notificationValidation.sendNotificationViaEmailAddress),
  notificationController.sendNotificationsViaEmailAddress
);
router.get('/', auth(), notificationController.getAllNotifications);

router.get('/user', auth(), notificationController.getAllUsersNotification);
router.get('/user/:id', auth(), notificationController.getUserNotificationById);
router.get('/get-notifications/:userId', auth(), notificationController.getNotification);
router.get('/get-not/:id', auth(), notificationController.getANotificationById);
router.post('/view-notification/:notificationId', auth(), notificationController.viewNotification);
router.post(
  '/send-notification/email',
  auth(),
  validate(notificationValidation.sendNotificationViaEmailAddress),
  notificationController.sendNotificationsViaEmailAddress
);
router.post(
  '/send-notification/userid',
  auth(),
  validate(notificationValidation.sendNotification),
  notificationController.sendNotifications
);

export default router;
