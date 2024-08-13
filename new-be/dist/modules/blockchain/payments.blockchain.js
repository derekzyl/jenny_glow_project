"use strict";
// import { CoinPayments, CoinPaymentsConfig } from '@bitaccess/coinlib';
// import { AddressType } from '@bitaccess/coinlib-bitcoin';
// import {
//   AnyPayments,
//   BalanceResult,
//   BaseTransactionInfo,
//   NetworkType,
//   ResolveablePayport,
//   SupportedCoinPaymentsSymbol,
// } from '@bitaccess/coinlib-common';
// import { BroadcastResult } from './interfaces/interfaces.payments.blockchain';
// class CryptoPayments {
//   public coinCode: string;
//   private payments: CoinPayments;
//   protected coinPayment: AnyPayments;
//   constructor(
//     seed: string,
//     coinCode: SupportedCoinPaymentsSymbol = 'BTC',
//     network: NetworkType = NetworkType.Testnet,
//     BTCAddressType: AddressType = AddressType.SegwitP2SH
//   ) {
//     this.payments = new CoinPayments({ network, seed, logger: console, BTC: { addressType: BTCAddressType } });
//     this.coinCode = coinCode;
//     this.coinPayment = this.payments.forNetwork(coinCode);
//   }
//   public async init(): Promise<void> {
//     return this.coinPayment.init();
//   }
//   public async changeNetwork(coinCode: SupportedCoinPaymentsSymbol = 'BTC'): Promise<AnyPayments> {
//     this.coinPayment = this.payments.forNetwork(coinCode);
//     await this.init();
//     return this.coinPayment;
//   }
//   public async getPublicConfig(): Promise<CoinPaymentsConfig> {
//     return this.payments.getPublicConfig();
//   }
//   public async isNetworkConfigured(networkSymbol: SupportedCoinPaymentsSymbol = 'BTC'): Promise<boolean> {
//     return this.payments.isNetworkConfigured(networkSymbol);
//   }
//   public async isNetworkSupported(networkSymbol: string): Promise<boolean> {
//     return this.payments.isNetworkSupported(networkSymbol);
//   }
//   // keep track of which path node (increasing int)
//   public async getPayport(portId: number) {
//     return this.coinPayment.getPayport(portId);
//   }
//   public async getBalance(payport: ResolveablePayport): Promise<BalanceResult> {
//     // BalanceMonitor;
//     return this.coinPayment.getBalance(payport);
//   }
//   // Get a transaction and check if it is confirmed
//   public async transactionIsConfirmed(txHash: string): Promise<boolean> {
//     const txInfo = await this.coinPayment.getTransactionInfo(txHash, {});
//     if (txInfo.isConfirmed) {
//       // OR txInfo.confirmations > 0
//       return true;
//     }
//     return false;
//   }
//   // Get a transaction details
//   public async transactionDetails(txHash: string): Promise<BaseTransactionInfo> {
//     const txInfo = await this.coinPayment.getTransactionInfo(txHash, {});
//     return txInfo;
//   }
//   public async isValidAddress(address: string): Promise<boolean> {
//     if (this.coinPayment.isValidAddress(address)) {
//       return true;
//     }
//     return false;
//   }
//   public async sendSweepTransaction(from: number | string, to: ResolveablePayport): Promise<BroadcastResult> {
//     try {
//       const unsignedTx = await this.coinPayment.createSweepTransaction(from, to);
//       const signedTx = await this.coinPayment.signTransaction(unsignedTx);
//       const result = await this.coinPayment.broadcastTransaction(signedTx);
//       return result;
//     } catch (error) {
//       throw new Error(`failed to send sweep transaction: ${error}`);
//     }
//   }
//   public async sendSimpleTransaction(from: number, to: ResolveablePayport, amount: string): Promise<BroadcastResult> {
//     try {
//       const unsignedTx = await this.coinPayment.createTransaction(from, to, amount);
//       const signedTx = await this.coinPayment.signTransaction(unsignedTx);
//       const result = await this.coinPayment.broadcastTransaction(signedTx);
//       return result;
//     } catch (error) {
//       throw new Error(`failed to send transaction: ${error}`);
//     }
//   }
// }
// export default CryptoPayments;
// // https://github.com/tboydston/incoming-crypto-deposit-tracking/
// // https://www.quora.com/How-do-I-sweep-Bitcoin-in-the-new-wallet-with-Electrum-step-by-step-What-do-I-write-in-the-console
// // https://live.blockcypher.com/btc-testnet/tx/b0bfdfb26c24d393d2b25545a92d624cc0013247cd56eba922613bd7f449840d/
// // https://coinfaucet.eu/en/btc-testnet/
//# sourceMappingURL=payments.blockchain.js.map