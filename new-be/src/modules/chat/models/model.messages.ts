/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/no-extraneous-dependencies
import { MessagesI } from '@modules/chat/interface.chat';
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema<MessagesI>(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'CHATS' },
    isRead: { type: Boolean },
    message: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'USERS' },
  },
  {
    timestamps: true,
  }
);

export const MESSAGES = mongoose.model('MESSAGES', messageSchema);
