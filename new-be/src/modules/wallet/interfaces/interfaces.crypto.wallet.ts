import { QueryResult } from '@modules/paginate/paginate';
import mongoose, { Document, Model } from 'mongoose';
import { CryptoCurrencyCodesT } from '../../setting/currencies';

//  Wallet => [Crypto]
interface ICryptoHDWallet {
  userId: mongoose.Types.ObjectId;

  currencyCode: CryptoCurrencyCodesT;
  address: string;
  image: string;
  // user account balances
  received: string;
  sent: string;
  balance: string;
  pending: string;
  blocked: string;
  // ends here

  isActive: boolean;
  isExchange: boolean;
  // the uid is important
  uid: string;

  guid: string;

  addressRef: string;
  mode: 'TEST' | 'LIVE';
  network: 'TESTNET' | 'MAINNET';
  assetType: string; // BTC | ETH
  addressType: string; // BTC | ETH
  isContract: boolean;
  isChangeAddress: boolean;
  derivationIndex: number;
  label: string;
  chain: string;
  assetId: string;
  organizationId: string;
  used: boolean;
  addressContractIdentifier: any; // You can replace `any` with a more specific type if needed.
  deploymentParams: any; // You can replace `any` with a more specific type if needed.
  lastUsedAt: string | null;
  bal: {
    received: string;
    sent: string;
    balance: string;
    pending: string;
    blocked: string;
  };
}

export interface ICryptoHDWalletDoc extends ICryptoHDWallet, Document {}

export interface ICryptoHDWalletModel extends Model<ICryptoHDWalletDoc> {
  isExists(
    userId: mongoose.Types.ObjectId,
    currencyCode: string,
    excludeWalletId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateHDWalletBody = Partial<ICryptoHDWallet>;
export type NewCreatedHDWallet = Omit<ICryptoHDWallet, ''>;
export type NewRegisteredHDWallet = Pick<ICryptoHDWallet, 'currencyCode'>;

// export interface IWalletWithTransactions {
//   wallet: IWalletDoc;
//   transactions: ITransactionDoc;
// }
// accounts: ActiveAccount[];

interface ICryptoTransactionPayload {
  userId: mongoose.Types.ObjectId;
  currencyCode: CryptoCurrencyCodesT; // SupportedCoinPaymentsSymbol;
  amount: string;
  toAddress: string;
}
export type NewCryptoTransactionPayload = Omit<ICryptoTransactionPayload, 'userId'>;
