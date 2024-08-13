import { Request, Response } from 'express';

import { IOptions } from '@modules/paginate/paginate';
import { catchAsync } from '@modules/utils';
import { easyPick } from '@modules/utils/pick';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-cycle
import { chatService } from '.';
import { ChatI, MessagesI } from './interface.chat';

export const createChat = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const chatData: Omit<ChatI, 'ref'> & { message: string } = {
    title: req.body.title,
    userId: user.id,
    isClosed: false,
    message: req.body.message,
    staff: [],
  };

  const chat = await chatService.createChatInDb(chatData);
  res.status(201).json(chat);
});

export const getChatById = catchAsync(async (req: Request, res: Response) => {
  const chatId = new mongoose.Types.ObjectId(req.params['id']);
  const chat = await chatService.getChatById(chatId);
  if (!chat) {
    res.status(404).json({ message: 'Chat not found' });
  }
  res.json(chat);
});

export const deleteChatById = catchAsync(async (req: Request, res: Response) => {
  const chatId = new mongoose.Types.ObjectId(req.params['id']);
  const deletedChat = await chatService.deleteChatById(chatId);
  if (!deletedChat) {
    res.status(404).json({ message: 'Chat not found' });
  }
  res.json(deletedChat);
});

export const getAllChats = catchAsync(async (req: Request, res: Response) => {
  const filter = easyPick<ChatI>(req.query, ['ref', 'title', 'userId', 'isClosed']);
  const options: IOptions = req.query;
  const chats = await chatService.getManyChat(options, filter);
  res.send(chats);
});

export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const { chatId } = req.params;
  const { message } = req.body;
  const messageData: MessagesI = {
    chatId: new mongoose.Types.ObjectId(chatId),
    senderId: user.id,
    isRead: false,
    message,
  };

  const newMessage = await chatService.createMessageInDb(messageData);
  res.status(201).json(newMessage);
});

export const getMessageById = catchAsync(async (req: Request, res: Response) => {
  const messageId = new mongoose.Types.ObjectId(req.params['id']);
  const message = await chatService.getMessageById(messageId);
  if (!message) {
    res.status(404).json({ message: 'Message not found' });
  }
  res.json(message);
});

export const deleteMessageById = catchAsync(async (req: Request, res: Response) => {
  const messageId = new mongoose.Types.ObjectId(req.params['id']);
  const deletedMessage = await chatService.deleteMessageById(messageId);
  if (!deletedMessage) {
    res.status(404).json({ message: 'Message not found' });
  }
  res.json(deletedMessage);
});

export const getAllMessages = catchAsync(async (req: Request, res: Response) => {
  const filter = req.query;
  // const options: IOptions = req.query;
  const chatId = new mongoose.Types.ObjectId(req.params['chatId']);
  const messages = await chatService.getManyMessage({}, { chatId, ...filter });
  res.json(messages);
});
export const getAllMessagesByUser = catchAsync(async (req: Request, res: Response) => {
  const messages = await chatService.getAllMessagesByUser(req.user.id);
  res.send(messages);
});

export const transferChat = catchAsync(async (req: Request, res: Response) => {
  const newData = req.body;
  const chatId = new mongoose.Types.ObjectId(req.params['chatId']);

  const chatData = {
    chatId,
    transferredTo: newData.transferredTo,
    transferredBy: req.user.id,
    handledBy: newData.handledBy,
    date: new Date(),
  };

  const updatedChat = await chatService.transferChat(chatData);
  res.json(updatedChat);
});

export const addStaffToChat = catchAsync(async (req: Request, res: Response) => {
  const { staffId, chatId } = req.body;

  const updatedChat = await chatService.addStaffToChat(staffId, chatId);
  res.json(updatedChat);
});

export const closeChat = catchAsync(async (req: Request, res: Response) => {
  const chatId = new mongoose.Types.ObjectId(req.params['id']);
  const { user } = req;

  const closedChat = await chatService.closeChat(chatId, user.id);
  res.json(closedChat);
});

export const getChatAndMessagesById = catchAsync(async (req: Request, res: Response) => {
  const chatId = new mongoose.Types.ObjectId(req.params['id']);
  const { query } = req;

  const chatAndMessages = await chatService.getChatAndMessagesById(chatId, query);
  res.json(chatAndMessages);
});

export const getUsersCurrentChat = catchAsync(async (req: Request, res: Response) => {
  const { query } = req;
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const userChat = await chatService.getUsersCurrentChat(query, userId);
  res.json(userChat);
});

export const getChatByData = catchAsync(async (req: Request, res: Response) => {
  const chatRef = req.query;

  const chat = await chatService.getChatByData(chatRef);
  res.json(chat);
});

export const getManyChat = catchAsync(async (req: Request, res: Response) => {
  const filter = easyPick<ChatI>(req.query, ['ref', 'title', 'userId', 'isClosed']);
  const options: IOptions = req.query;

  const chats = await chatService.getManyChat(options, filter);
  res.json(chats);
});
