import { QueryResult } from '@modules/paginate/paginate';
import { AccessAndRefreshTokens } from '@modules/token/interfaces.token';
import mongoose, { Document, Model } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  refId?: string;
  isAbove18?: boolean;
  privacyAndPolicy?: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified' | 'refId' | 'isAbove18' | 'privacyAndPolicy'> & {
  refBy?: string;
};

export type NewCreatedUser = Omit<IUser, 'isEmailVerified' | 'isAbove18' | 'privacyAndPolicy'>;

export type UpdateUserPasswordBody = Omit<IUser, 'firstName' | 'lastName' | 'email' | 'role' | 'isEmailVerified'> & {
  newPassword: string;
  confirmNewPassword: string;
};

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}
