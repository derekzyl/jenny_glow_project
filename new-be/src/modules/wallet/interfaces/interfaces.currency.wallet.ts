import { QueryResult } from '@modules/paginate/paginate';
import mongoose, { Document, Model } from 'mongoose';

// Currencies
interface ICurrency {
  name: string;
  code: string;
  image: string;
  symbol: string;
  currencyType: string;
  pricePctDifference: number;
  minDeposit: number;
  minWithdraw: number;
  maxWithdraw: number;
  uid: string;
  mode: 'LIVE' | 'TEST';
  network: 'MAINNET' | 'TESTNET';
  label: string;
  feeType: string;
  depositFee: number;
  withdrawFee: number;
  isActive: boolean;
  createdByUserId: mongoose.Types.ObjectId;
  updatedByUserId: mongoose.Types.ObjectId;
}

export interface ICurrencyDoc extends ICurrency, Document {}
export interface ICurrencyModel extends Model<ICurrencyDoc> {
  isCodeTaken(code: string, excludeCurrencyId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateCurrencyBody = Omit<Partial<ICurrency>, 'createdByUserId'>;
export type NewCreatedCurrency = Omit<ICurrency, ''>;
export type NewRegisteredCurrency = Omit<ICurrency, 'createdByUserId' | 'updatedByUserId'>;
