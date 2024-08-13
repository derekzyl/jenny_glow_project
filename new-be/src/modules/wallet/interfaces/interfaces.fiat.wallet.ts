import { CreatePaymentPayload, CreatePaymentResponse } from '@modules/flutterwave/interfaces/interface.payments.flutterwave';
import { QueryResult } from '@modules/paginate/paginate';
import mongoose, { Document, Model } from 'mongoose';

//  Wallet => [Crypto, Fiat]

interface IFiatWallet {
  userId: mongoose.Types.ObjectId;
  image: string;
  currencyCode: string;

  balance: number;
  isActive: boolean;
  isExchange: boolean;
}

export interface IFiatWalletDoc extends IFiatWallet, Document {}
export interface IFiatWalletModel extends Model<IFiatWalletDoc> {
  isExists(
    userId: mongoose.Types.ObjectId,
    currencyCode: string,
    excludeWalletId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateFiatWalletBody = Partial<IFiatWallet>;
export type NewRegisteredFiatWallet = Omit<IFiatWallet, 'userId' | 'balance' | 'currencyType' | 'isActive' | 'image'>;
export type NewCreatedFiatWallet = Omit<IFiatWallet, ''>;

//
interface IPaymentPayload extends CreatePaymentPayload {
  userId: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
  redirectUrl: string;
  narration: string;
  provider: string;
}

export type NewPaymentPayload = Omit<
  IPaymentPayload,
  'tx_ref' | 'redirect_url' | 'meta' | 'customizations' | 'subaccounts' | 'payment_options'
>;

interface IPaymentResponse extends CreatePaymentResponse {
  paymentLink: string;
}
export type NewPaymentResponse = Omit<IPaymentResponse, 'data' | 'status' | 'message'>;

interface IFiatExchange {
  userWallet: IFiatWalletDoc;
  currencyCode: string;
  amount: number;
  isComplete: boolean;
  status: string;
  ref: string;
  description: string;
  uid: string;
}

export type NewFiatExchange = Omit<IFiatExchange, ''>;
