/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';
import { Socket as Sckt } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { staffService } from '@modules/admin/staff';
import { logger } from '@modules/logger';
import { IUserDoc } from '@modules/user/interfaces.user';
import { chatService } from '.';
import { ChatI, MessagesI } from './interface.chat';

export class ChatSocket {
  private socket: Sckt<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  private user: IUserDoc;

  constructor(socket: Sckt<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, user: IUserDoc) {
    logger.info(`'ChatSocket created' ${JSON.stringify(user)}`);
    this.user = user;
    this.socket = socket;
    logger.info('ChatSocket created');
    this.socket.on('initiateChat', this.currentChat.bind(this));
    this.socket.on('createChat', this.createChat.bind(this));
    this.socket.on('createMessage', this.createMessage.bind(this));
    this.socket.on('userTyping', this.userTyping.bind(this));
    this.socket.on('getMessages', this.getMessages.bind(this));
    this.socket.on('getMessagesByStaff', this.getMessagesByStaff.bind(this));
  }

  async currentChat() {
    if (!this.user) return;
    const getChat = await chatService.getUsersCurrentChat({}, this.user.id);
    if (getChat) this.socket.emit('currentChat', getChat);
    else {
      this.socket.emit('currentChat', null);
    }
  }

  async createChat(data: Omit<ChatI, 'ref' | 'userId' | 'isClosed'> & { message: string }) {
    if (!this.user) return;
    const updateChat = await chatService.createChatInDb({ userId: this.user.id, ...data });
    this.socket.emit('currentChat', updateChat);
  }

  async createMessage(data: Omit<MessagesI, 'senderId'>) {
    if (!this.user) return;
    const updateChat = await chatService.createMessageInDb({ senderId: this.user.id, ...data });
    this.socket.to(String(data.chatId)).emit('message', updateChat);
    const getChatById = await chatService.getManyMessage({}, { chatId: data.chatId, senderId: this.user.id });
    this.socket.emit('currentMessage', getChatById);
  }

  async getMessages(data: mongoose.Types.ObjectId) {
    if (!this.user) return;
    const getChatById = await chatService.getManyMessage({}, { chatId: data, senderId: this.user.id });
    this.socket.emit('currentMessage', getChatById);
  }

  async getMessagesByStaff(data: mongoose.Types.ObjectId) {
    if (!this.user) return;
    const getStaff = await staffService.getAllStaffsUserId();
    if (!getStaff?.includes(this.user.id)) return;
    const getChatById = await chatService.getManyMessage({}, { chatId: data });
    this.socket.emit('currentMessage', getChatById);
  }

  async userTyping(data: { chatId: string; isTyping: boolean }) {
    if (!this.user) return;
    this.socket.to(String(data.chatId)).emit('userTyping', data);
  }
}
