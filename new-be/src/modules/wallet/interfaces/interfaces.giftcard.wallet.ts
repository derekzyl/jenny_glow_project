import { QueryResult } from '@modules/paginate/paginate';
import mongoose, { Document, Model } from 'mongoose';

// Giftcards
export interface IGiftcard {
  merchant: mongoose.Types.ObjectId;
  name: string;
  recipient: string;
  message: string;
  amount: number;
  currency: string;
  rateInUSD: number;
  refBonus: number;

  pricePctDiffrence: number;
  isActive: boolean;
  createdByUserId: mongoose.Types.ObjectId;
  updatedByUserId: mongoose.Types.ObjectId;
}

export interface IGiftcardDoc extends IGiftcard, Document {}
export interface IGiftcardModel extends Model<IGiftcardDoc> {
  isExists(name: string, excludeCardId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateGiftcardBody = Omit<Partial<IGiftcard>, 'createdByUserId'>;
export type NewCreatedGiftcard = Omit<IGiftcard, ''>;
export type NewRegisteredGiftcard = Omit<IGiftcard, 'createdByUserId' | 'updatedByUserId'>;

export interface GiftCardMerchantI {
  name: string;
  image: string;
  active: boolean;
  createdByUserId: mongoose.Types.ObjectId;
  updatedByUserId: mongoose.Types.ObjectId;
}
export interface GiftCardMerchantDocI extends GiftCardMerchantI, Document {}
export interface GiftCardMerchantModelI extends Model<GiftCardMerchantDocI> {
  isExists(name: string, excludeCardId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateGiftCardMerchantBody = Omit<Partial<GiftCardMerchantI>, 'createdByUserId'>;
export type NewCreatedGiftCardMerchant = Omit<GiftCardMerchantI, ''>;
export type NewRegisteredGiftCardMerchant = Omit<GiftCardMerchantI, 'createdByUserId' | 'updatedByUserId'>;
