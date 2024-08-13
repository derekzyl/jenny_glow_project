import { auth } from '@modules/auth';
import { allPermissions } from '@modules/setting/roles';
import { validate } from '@modules/validate';
import express, { Router } from 'express';
import { chatController, chatValidations } from '..';

const router: Router = express.Router();
router.post('/', auth(), validate(chatValidations.createChat), chatController.createChat);

// Get Chat By Id
router.get('/:id', auth(/* permission to access chat */), validate(chatValidations.getChatById), chatController.getChatById);

// Delete Chat By Id
router.delete(
  '/:id',
  auth(...Object.values(allPermissions.Chats), allPermissions.SuperAdmin),
  validate(chatValidations.deleteChatById),
  chatController.deleteChatById
);

// Get All Chats
router.get('/', auth(/* permission to get chats */), validate(chatValidations.getAllChats), chatController.getAllChats);

// Message Routes

// Create Message
router.post(
  '/:chatId/messages',
  auth(/* permission to send message */),
  validate(chatValidations.createMessage),
  chatController.createMessage
);

// Get Message By Id
router.get(
  '/messages/:id',
  auth(/* permission to access message */),
  validate(chatValidations.getMessageById),
  chatController.getMessageById
);
router.get(
  '/users-messages/all',
  auth(/* permission to access message */),

  chatController.getAllMessagesByUser
);

// Delete Message By Id
router.delete(
  '/messages/:id',
  auth(/* permission to delete message */),
  validate(chatValidations.deleteMessageById),
  chatController.deleteMessageById
);

// Get All Messages
router.get(
  '/:chatId/messages',
  auth(/* permission to access messages */),
  validate(chatValidations.getAllMessages),
  chatController.getAllMessages
);

// Other Chat functionalities (implement validation as needed)
router.patch(
  '/:chatId/transfer',
  auth(...Object.values(allPermissions.Chats), allPermissions.SuperAdmin),
  validate(chatValidations.transferChat),
  chatController.transferChat
);
router.patch(
  '/:id/staff',
  auth(...Object.values(allPermissions.Chats), allPermissions.SuperAdmin),
  validate(chatValidations.addStaffToChat),
  chatController.addStaffToChat
);
router.patch(
  '/:id/close',
  auth(...Object.values(allPermissions.Chats), allPermissions.SuperAdmin),
  validate(chatValidations.closeChat),
  chatController.closeChat
);
router.get(
  '/:id/details',
  auth(...Object.values(allPermissions.Chats), allPermissions.SuperAdmin),
  validate(chatValidations.getChatAndMessagesById),
  chatController.getChatAndMessagesById
);
router.get(
  '/users/userId/chats',
  auth(/* permission to access user chats */),
  validate(chatValidations.getUsersCurrentChat),
  chatController.getUsersCurrentChat
);
router.get(
  '/by-ref/:ref',
  auth(/* permission to access chat by ref */),
  validate(chatValidations.getChatByData),
  chatController.getChatByData
);
router.get(
  '/',
  auth(...Object.values(allPermissions.Chats), allPermissions.SuperAdmin),
  validate(chatValidations.getAllChats),
  chatController.getManyChat
);
export default router;
