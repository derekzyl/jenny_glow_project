import { QueryResult } from '@modules/paginate/paginate';
import mongoose, { Document, Model } from 'mongoose';

export interface IUserPin {
  userId: mongoose.Types.ObjectId;
  pin: string;
  pinAttempts: number;
  pinAttemptTime: string;
}

export interface IUserPinDoc extends IUserPin, Document {
  isPinMatch(password: string): Promise<boolean>;
}

export interface IUserPinModel extends Model<IUserPinDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserPinBody = Omit<Partial<IUserPin>, 'userId'> & { otpCode?: string };

export type NewCreatedUserPin = Pick<IUserPin, 'pin'>;
