import { QueryResult } from '@modules/paginate/paginate';
import mongoose, { Types } from 'mongoose';

// everything about referral
export interface ReferralI {
  userId: Types.ObjectId;
  refId: string;
  refBy?: Types.ObjectId | undefined;
  totalRef: number;
  refBalance: number;
}
export interface ReferralIDoc extends ReferralI, Document {}

export interface ReferralIModel extends mongoose.Model<ReferralIDoc> {
  isRefUsed(reference: string, excludeBillId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateReferralBody = Omit<Partial<ReferralI>, 'userId'>;
export type NewCreatedReferral = Omit<ReferralI, ''>;
export type NewRegisteredReferral = Omit<ReferralI, 'userId'>;

// everything about referral bonus
export interface RefsBonusI {
  userId: Types.ObjectId;
  referral: Types.ObjectId;
  details: string;
  type: 'GIFTCARD' | 'SWAP';
  bonus: number;
}

export interface RefsBonusIDoc extends RefsBonusI, Document {}

export interface RefsBonusIModel extends mongoose.Model<RefsBonusIDoc> {
  isExists(reference: string, excludeBillId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateRefsBonusBody = Omit<Partial<RefsBonusI>, 'userId'>;
export type NewCreatedRefsBonus = Omit<RefsBonusI, ''>;
export type NewRegisteredRefsBonus = Omit<RefsBonusI, 'userId'>;

// everything about all users that that person referred
export interface UserReferralI {
  userId: Types.ObjectId;
  ref: Types.ObjectId;
  totalAmount: number;
}

export interface UserReferralIDoc extends UserReferralI, Document {}

export interface UserReferralIModel extends mongoose.Model<UserReferralIDoc> {
  isExists(reference: string, excludeBillId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserReferralBody = Omit<Partial<UserReferralI>, 'userId'>;
export type NewCreatedUserReferral = Omit<UserReferralI, ''>;
export type NewRegisteredUserReferral = Omit<UserReferralI, 'userId'>;

// referral transactions
export interface RefTransactionI {
  userId: Types.ObjectId;
  transType: 'DEPOSIT' | 'WITHDRAWAL';
  reference: string;
  referral: Types.ObjectId;
  type: 'GIFTCARD' | 'SWAP' | 'TRANSFER' | 'BILLS';
  amount: number;
  fee: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}

export interface RefTransactionIDoc extends RefTransactionI, Document {}

export interface RefTransactionIModel extends mongoose.Model<RefTransactionIDoc> {
  isExists(reference: string, excludeBillId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateRefTransactionBody = Omit<Partial<RefTransactionI>, 'userId'>;
export type NewCreatedRefTransaction = Omit<RefTransactionI, ''>;
export type NewRegisteredRefTransaction = Omit<RefTransactionI, 'userId'>;
