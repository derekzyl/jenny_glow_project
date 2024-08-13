// import { QueryResult } from '@modules/paginate/paginate';
// import { Document, Model } from 'mongoose';

// import { TransactionStatus } from '@bitaccess/coinlib-common';

export interface ICryptoCurrencyNetwork {
  rpcUrlAddress: string;
  wssUrlAddress: string;
  decimals: number;
  reserved: boolean;
  networkName: string;
}

export interface BalanceResultAPI {
  confirmedBalance: string;
  unconfirmedBalance: string;
  spendableBalance: string;
}

export interface WalletResultAPI {
  address: string;
  extraId: string;
}

export interface SendResultAPI {
  id: string;
  confirmations: number;
  isConfirmed: boolean;
  status: string;
}
export interface TransactionDetailsResultAPI {
  id: string;
  confirmations: number;
  isConfirmed: boolean;
  fee: string;
  amount: string;
  status: string;
}

//  ICryptoNetwork
// export interface ICryptoNetworkDoc extends ICryptoNetwork, Document {}

// export interface ICryptoNetworkModel extends Model<ICryptoNetworkDoc> {
//   paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
// }

// export interface AccountInfo {
//   BTC: number;
//   ETH: number;
//   LTC: number;
//   XRP: number;
//   DOGE: number;

//   // eth contracts
//   USDT: number;
// }
