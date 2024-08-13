import mongoose from 'mongoose';

export type StaffChatT = {
  handledBy: mongoose.Types.ObjectId;
  transferredTo?: mongoose.Types.ObjectId;
  transferredBy?: mongoose.Types.ObjectId;
  date?: Date;
};

export interface ChatI {
  ref?: string;
  title: string;

  userId: mongoose.Types.ObjectId;
  isClosed?: boolean;

  staff?: StaffChatT[];
}

export interface ChatModel extends ChatI, mongoose.Document {}

export interface MessagesI {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  isRead: boolean;

  message: string;
}
export interface MessageModel extends MessagesI, mongoose.Document {}
