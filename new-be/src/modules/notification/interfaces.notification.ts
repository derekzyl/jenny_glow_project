import { Document, Types } from 'mongoose';

export interface INotification {
  userId: Types.ObjectId;
  title: string;
  body: string;
  viewed: boolean;
  type: string;
}

export interface INotificationDoc extends INotification, Document {}
export type UpdateNotificationBody = Partial<INotification>;
