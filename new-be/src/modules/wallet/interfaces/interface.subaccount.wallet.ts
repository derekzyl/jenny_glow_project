import { SubAccountBitpwrCreationResponseDataI } from '@modules/bitpwr/interfaces/interface.subaccount.bitpwr';
import { QueryResult } from '@modules/paginate/paginate';

import { Document, Model, Types } from 'mongoose';

export interface SubAccountCryptoUserI
  extends Omit<SubAccountBitpwrCreationResponseDataI, 'accountId' | 'createdAt' | 'updatedAt' | 'addresses'> {
  userId: Types.ObjectId;
  addressesId: Array<Types.ObjectId>;
  balance: {
    received: string;
    sent: string;
    balance: string;
    blocked: string;
    pending: string;
    total: string;
  };
}

export interface SubAccountCryptoUserDocI extends SubAccountCryptoUserI, Document {}
export interface SubAccountCryptoUserModelI extends Model<SubAccountCryptoUserDocI> {
  isExists(userId: Types.ObjectId, currencyCode: string, excludeWalletId?: Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
